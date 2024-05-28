package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.constants.Constants.CHAT;
import static com.vip.interviewpartner.common.constants.Constants.DATA;
import static com.vip.interviewpartner.common.constants.Constants.EVENT;
import static com.vip.interviewpartner.common.constants.Constants.SERVER_DATA;
import static com.vip.interviewpartner.common.constants.Constants.SESSION_ID;
import static com.vip.interviewpartner.common.constants.Constants.TYPE;

import com.vip.interviewpartner.common.constants.WebhookEvent;
import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Message;
import com.vip.interviewpartner.domain.Room;
import com.vip.interviewpartner.dto.RoomChatDTO;
import com.vip.interviewpartner.dto.RoomEnterUserData;
import com.vip.interviewpartner.repository.MessageRepository;
import com.vip.interviewpartner.repository.RoomParticipantRepository;
import com.vip.interviewpartner.repository.RoomRepository;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * WebhookService 클래스는 OpenVidu 웹훅 이벤트를 처리하는 서비스입니다.
 * 이 서비스는 방 세션이 종료되거나, 참가자가 입장 또는 퇴장할 때, 채팅 시 호출됩니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class WebhookService {

    private final MemberService memberService;
    private final RoomService roomService;
    private final RoomRepository roomRepository;
    private final RoomParticipantRepository roomParticipantRepository;
    private final MessageRepository messageRepository;

    @Value("${openvidu.webhook.auth-header}")
    private String authHeaderValue;

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
        switch (WebhookEvent.findByEventType(eventType)) {
            case SESSION_DESTROYED:
                handleSessionDestroyed(payload);
                break;
            case PARTICIPANT_JOINED:
                handleParticipantJoined(payload);
                break;
            case PARTICIPANT_LEFT:
                handleParticipantLeft(payload);
                break;
            case SIGNAL_SENT:
                handleSignalSent(payload);
                break;
            default:
                log.warn("Unknown event type: {}", eventType);
        }
    }

    /**
     * 세션이 종료될 때 호출됩니다.
     * 방 상태를 종료로 변경합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleSessionDestroyed(Map<String, Object> payload) {
        String sessionId = payload.get(SESSION_ID).toString();
        roomRepository.findBySessionId(sessionId).ifPresent(room -> {
            room.close();
        });
        log.info("Room with session ID {} closed.", sessionId);
    }

    /**
     * 참가자가 입장할 때 호출됩니다.
     * 참가자의 입장시각을 업데이트합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleParticipantJoined(Map<String, Object> payload) {
        RoomEnterUserData serverData = RoomEnterUserData.fromJson(payload.get(SERVER_DATA).toString());
        LocalDateTime joinDate = DateTimeUtil.extractTimestamp(payload);
        roomParticipantRepository.findById(serverData.getRoomParticipantId())
                .ifPresent(roomParticipant -> roomParticipant.join(joinDate));
        log.info("Participant joined (memberId: {}, roomId: {}).", serverData.getMemberId(), serverData.getRoomId());
    }

    /**
     * 참가자가 퇴장할 때 호출됩니다.
     * 참가자의 퇴장시각을 업데이트합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleParticipantLeft(Map<String, Object> payload) {
        RoomEnterUserData serverData = RoomEnterUserData.fromJson(payload.get(SERVER_DATA).toString());
        LocalDateTime leaveDate = DateTimeUtil.extractTimestamp(payload);
        roomParticipantRepository.findById(serverData.getRoomParticipantId())
                .ifPresent(roomParticipant -> roomParticipant.leave(leaveDate));
        log.info("Participant left (memberId: {}, roomId: {}).", serverData.getMemberId(), serverData.getRoomId());
    }

    /**
     * 시그널이 전송될 때 호출됩니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleSignalSent(Map<String, Object> payload) {
        String type = payload.get(TYPE).toString();
        if (type.equals(CHAT)) {
            handleChatSignal(payload);
        } else {
            log.warn("Unhandled signal type: {}", type);
        }
    }

    /**
     * 채팅 시그널이 전송 될 때 호출됩니다.
     * 채팅을 저장합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     */
    private void handleChatSignal(Map<String, Object> payload) {
        String data = payload.get(DATA).toString();
        LocalDateTime messageTimestamp = DateTimeUtil.extractTimestamp(payload);
        RoomChatDTO roomChatDTO = RoomChatDTO.fromJson(data);
        Member member = memberService.getMemberById(roomChatDTO.getMemberId());
        Room room = roomService.getRoomById(roomChatDTO.getRoomId());
        messageRepository.save(Message.builder()
                .sender(member)
                .room(room)
                .content(roomChatDTO.getContent())
                .createDate(messageTimestamp)
                .build());
        log.info("Chat message in room {} by memberId {}: {}", roomChatDTO.getRoomId(), roomChatDTO.getMemberId(), roomChatDTO.getContent());
    }
}
