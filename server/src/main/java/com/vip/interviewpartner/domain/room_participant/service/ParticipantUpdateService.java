package com.vip.interviewpartner.domain.room_participant.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.constants.Constants;
import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.openvidu.entity.WebhookEvent;
import com.vip.interviewpartner.domain.room.dto.response.RoomEnterUserData;
import com.vip.interviewpartner.domain.room_participant.repository.RoomParticipantRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ParticipantUpdateService {
    public static final String PARTICIPANT_EVENTS_QUEUE = "openvidu.participant.events.queue";

    private final ObjectMapper objectMapper;
    private final RoomParticipantRepository roomParticipantRepository;

    /**
     * 참가자 관련 이벤트를 처리하는 리스너
     */
    @RabbitListener(queues = PARTICIPANT_EVENTS_QUEUE)
    public void receiveParticipantEvent(String message) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(message);
        String eventType = rootNode.path("event").asText();
        WebhookEvent webhookEvent = WebhookEvent.from(eventType);
        switch (webhookEvent) {
            case PARTICIPANT_JOINED -> handleParticipantJoined(rootNode);
            case PARTICIPANT_LEFT -> handleParticipantLeft(rootNode);
            default -> log.warn("Unhandled participant event type: {}", eventType);
        }
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
}
