package com.vip.interviewpartner.service;

import com.vip.interviewpartner.dto.RoomEnterUserData;
import com.vip.interviewpartner.repository.RoomParticipantRepository;
import com.vip.interviewpartner.repository.RoomRepository;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * WebhookService 클래스는 OpenVidu 웹훅 이벤트를 처리하는 서비스입니다.
 * 이 서비스는 방 세션이 종료되거나, 참가자가 입장 또는 퇴장할 때 호출됩니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class WebhookService {

    private final RoomRepository roomRepository;
    private final RoomParticipantRepository roomParticipantRepository;

    @Value("${openvidu.webhook.auth-header}")
    private String authHeaderValue;

    private static final String EVENT = "event";
    private static final String SESSION_DESTROYED = "sessionDestroyed";
    private static final String PARTICIPANT_JOINED = "participantJoined";
    private static final String PARTICIPANT_LEFT = "participantLeft";
    private static final String SESSION_ID = "sessionId";
    private static final String SERVER_DATA = "serverData";
    private static final String TIMESTAMP = "timestamp";
    private static final String TIME_ZONE = "Asia/Seoul";

    /**
     * 웹훅 인증 헤더가 유효한지 확인합니다.
     *
     * @param authHeader 웹훅 요청의 인증 헤더
     * @return 인증 헤더가 유효한지 여부
     */
    public boolean isValidAuthHeader(String authHeader) {
        return authHeaderValue.equals(authHeader);
    }

    /**
     * 웹훅 이벤트를 처리합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    @Transactional
    public void handleWebhookEvent(Map<String, Object> payload) {
        String eventType = payload.get(EVENT).toString();
        switch (eventType) {
            case SESSION_DESTROYED:
                handleSessionDestroyed(payload);
                break;
            case PARTICIPANT_JOINED:
                handleParticipantJoined(payload);
                break;
            case PARTICIPANT_LEFT:
                handleParticipantLeft(payload);
                break;
            default:
                log.warn("Unknown event type: {}", eventType);
        }
    }

    /**
     * 세션이 종료될 때 호출됩니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleSessionDestroyed(Map<String, Object> payload) {
        String sessionId = payload.get(SESSION_ID).toString();
        roomRepository.findBySessionId(sessionId).ifPresent(room -> {
            room.close();
        });
    }

    /**
     * 참가자가 입장할 때 호출됩니다.
     * 참가자의 입장시각을 업데이트합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleParticipantJoined(Map<String, Object> payload) {
        RoomEnterUserData serverData = RoomEnterUserData.fromJson(payload.get(SERVER_DATA).toString());
        LocalDateTime joinDate = getDateTime(payload);
        roomParticipantRepository.findById(serverData.getRoomParticipantId())
                .ifPresent(roomParticipant -> roomParticipant.join(joinDate));
    }

    /**
     * 참가자가 퇴장할 때 호출됩니다.
     * 참가자의 퇴장시각을 업데이트합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleParticipantLeft(Map<String, Object> payload) {
        RoomEnterUserData serverData = RoomEnterUserData.fromJson(payload.get(SERVER_DATA).toString());
        LocalDateTime leaveDate = getDateTime(payload);
        roomParticipantRepository.findById(serverData.getRoomParticipantId())
                .ifPresent(roomParticipant -> roomParticipant.leave(leaveDate));
    }

    /**
     * payload 에서 타임스탬프를 추출하고 LocalDateTime 객체로 변환합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     * @return 타임스탬프를 기반으로 생성된 LocalDateTime 객체
     */
    private LocalDateTime getDateTime(Map<String, Object> payload) {
        Long timestamp = (Long) payload.get(TIMESTAMP);
        return Instant.ofEpochMilli(timestamp)
                .atZone(ZoneId.of(TIME_ZONE))
                .toLocalDateTime();
    }
}
