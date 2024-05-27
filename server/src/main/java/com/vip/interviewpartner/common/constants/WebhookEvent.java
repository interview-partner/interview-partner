package com.vip.interviewpartner.common.constants;

import java.util.Arrays;

/**
 * WebhookEvent 열거형은 웹훅 이벤트의 다양한 유형을 나타냅니다.
 * 각 열거형 상수는 이벤트 타입을 식별하는 문자열 값을 포함합니다.
 */
public enum WebhookEvent {
    SESSION_DESTROYED("sessionDestroyed"),
    PARTICIPANT_JOINED("participantJoined"),
    PARTICIPANT_LEFT("participantLeft"),
    SIGNAL_SENT("signalSent"),
    EMPTY("없음");

    private final String eventType;

    WebhookEvent(String eventType) {
        this.eventType = eventType;
    }

    public String getEventType() {
        return eventType;
    }

    /**
     * 주어진 이벤트 타입 문자열에 해당하는 WebhookEvent 열거형 상수를 반환합니다.
     * 일치하는 이벤트 타입이 없으면 EMPTY 상수를 반환합니다.
     *
     * @param eventType 이벤트 타입을 나타내는 문자열
     * @return 주어진 이벤트 타입에 해당하는 WebhookEvent 열거형 상수
     */
    public static WebhookEvent findByEventType(String eventType) {
        return Arrays.stream(WebhookEvent.values())
                .filter(event -> event.getEventType().equals(eventType))
                .findFirst()
                .orElse(EMPTY);
    }
}
