package com.vip.interviewpartner.domain.openvidu.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.constants.Constants;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.message.entity.Message;
import com.vip.interviewpartner.domain.message.repository.MessageRepository;
import com.vip.interviewpartner.domain.openvidu.entity.WebhookEvent;
import com.vip.interviewpartner.domain.room.dto.response.RoomChatDTO;
import com.vip.interviewpartner.domain.room.dto.response.RoomEnterUserData;
import com.vip.interviewpartner.domain.room.repository.RoomRepository;
import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
import com.vip.interviewpartner.domain.room_participant.repository.RoomParticipantRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Component
@Slf4j
public class OpenViduWebhookListener {

    private final ObjectMapper objectMapper;
    private final RoomRepository roomRepository;
    private final RoomParticipantRepository roomParticipantRepository;
    private final MessageRepository messageRepository;

//    @RabbitListener(queues = "q.openvidu")
    @Transactional
    public void receiveMessage(String message) {
        try {
            JsonNode rootNode = objectMapper.readTree(message);
            String eventType = rootNode.path("event").asText();
            WebhookEvent webhookEvent = WebhookEvent.from(eventType);
            switch (webhookEvent) {
                case SESSION_DESTROYED -> handleSessionDestroyed(rootNode);
                case PARTICIPANT_JOINED -> handleParticipantJoined(rootNode);
                case PARTICIPANT_LEFT -> handleParticipantLeft(rootNode);
                case SIGNAL_SENT -> handleSignalSent(rootNode);
            }
        } catch (Exception e) {
            log.error("Failed to handle webhook event", e);
            e.printStackTrace();
        }
    }

    private void handleSessionDestroyed(JsonNode eventNode) {
        String sessionId = eventNode.path(Constants.SESSION_ID).asText();
        roomRepository.findBySessionId(sessionId).ifPresent(room -> {
            room.close();
            log.info("Room with session ID {} closed.", sessionId);
        });
    }

    private void handleParticipantJoined(JsonNode eventNode) {
        JsonNode serverDataNode = eventNode.path(Constants.SERVER_DATA);
        RoomEnterUserData serverData = RoomEnterUserData.fromJson(serverDataNode.asText());
        LocalDateTime joinDate = DateTimeUtil.extractTimestamp(eventNode);

        roomParticipantRepository.findById(serverData.getRoomParticipantId())
                .ifPresent(roomParticipant -> {
                    roomParticipant.join(joinDate);
                    log.info("Participant joined: roomParticipantId={}, roomId={}",
                            serverData.getRoomParticipantId(), serverData.getRoomId());
                });
    }

    private void handleParticipantLeft(JsonNode eventNode) {
        JsonNode serverDataNode = eventNode.path(Constants.SERVER_DATA);
        RoomEnterUserData serverData = RoomEnterUserData.fromJson(serverDataNode.asText());
        LocalDateTime leaveDate = DateTimeUtil.extractTimestamp(eventNode);

        roomParticipantRepository.findById(serverData.getRoomParticipantId())
                .ifPresent(roomParticipant -> {
                    roomParticipant.leave(leaveDate);
                    log.info("Participant left: roomParticipantId={}, roomId={}",
                            serverData.getRoomParticipantId(), serverData.getRoomId());
                });
    }

    private void handleSignalSent(JsonNode rootNode) {
        String type = rootNode.path(Constants.TYPE).asText();
        if (type.equals(Constants.CHAT)) {
            handleChatSignal(rootNode);
        } else {
            log.warn("Unhandled signal type: {}", type);
        }
    }

    private void handleChatSignal(JsonNode rootNode) {
        String data = rootNode.path("data").asText();
        LocalDateTime messageTimestamp = DateTimeUtil.extractTimestamp(rootNode);
        RoomChatDTO roomChatDTO = RoomChatDTO.fromJson(data);

        RoomParticipant roomParticipant = roomParticipantRepository
                .findById(roomChatDTO.getRoomParticipantId())
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_PARTICIPANT_NOT_FOUND));

        Message message = Message.builder()
                .roomParticipant(roomParticipant)
                .content(roomChatDTO.getContent())
                .createDate(messageTimestamp)
                .build();
        messageRepository.save(message);
        log.info("Chat message saved: roomParticipantId={}, content={}",
                roomChatDTO.getRoomParticipantId(), roomChatDTO.getContent());
    }
}
