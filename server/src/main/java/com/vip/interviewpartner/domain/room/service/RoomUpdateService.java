package com.vip.interviewpartner.domain.room.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.constants.Constants;
import com.vip.interviewpartner.domain.openvidu.entity.WebhookEvent;
import com.vip.interviewpartner.domain.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RoomUpdateService {
    public static final String ROOM_EVENTS_QUEUE = "openvidu.room.events.queue";

    private final ObjectMapper objectMapper;
    private final RoomRepository roomRepository;

    /**
     * 방 관련 이벤트를 처리하는 리스너
     */
    @RabbitListener(queues = ROOM_EVENTS_QUEUE)
    public void receiveRoomEvent(String message) {
        try {
            JsonNode rootNode = objectMapper.readTree(message);
            String eventType = rootNode.path("event").asText();
            WebhookEvent webhookEvent = WebhookEvent.from(eventType);
            if (webhookEvent == WebhookEvent.SESSION_DESTROYED) {
                handleSessionDestroyed(rootNode);
            } else {
                log.warn("Unhandled room event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Failed to handle room event", e);
            // 필요 시, Dead Letter Queue로 메시지 전송하거나 재시도 로직 추가
        }
    }

    private void handleSessionDestroyed(JsonNode eventNode) {
        String sessionId = eventNode.path(Constants.SESSION_ID).asText();
        roomRepository.findBySessionId(sessionId).ifPresent(room -> {
            room.close();
            log.info("Room with session ID {} closed.", sessionId);
        });
    }

}
