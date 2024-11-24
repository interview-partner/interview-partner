package com.vip.interviewpartner.domain.message;

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
import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
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
public class MessageSaveService {
    public static final String CHAT_EVENTS_QUEUE = "openvidu.chat.events.queue";

    private final ObjectMapper objectMapper;
    private final MessageRepository messageRepository;
    private final RoomParticipantRepository roomParticipantRepository;

    /**
     * 채팅 관련 이벤트를 처리하는 리스너
     */
    @RabbitListener(queues = CHAT_EVENTS_QUEUE)
    @Transactional
    public void receiveChatEvent(String message) {
        try {
            JsonNode rootNode = objectMapper.readTree(message);
            String eventType = rootNode.path("event").asText();
            WebhookEvent webhookEvent = WebhookEvent.from(eventType);
            if (webhookEvent == WebhookEvent.SIGNAL_SENT) {
                handleSignalSent(rootNode);
            } else {
                log.warn("Unhandled chat event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Failed to handle chat event", e);
            // 필요 시, Dead Letter Queue로 메시지 전송하거나 재시도 로직 추가
        }
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
