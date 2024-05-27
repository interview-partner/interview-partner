package com.vip.interviewpartner.common.constants;

import java.util.Arrays;

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

    public static WebhookEvent findByEventType(String eventType) {
        return Arrays.stream(WebhookEvent.values())
                .filter(event -> event.getEventType().equals(eventType))
                .findFirst()
                .orElse(EMPTY);
    }
}
