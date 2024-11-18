package com.vip.interviewpartner.common.util;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
public class DateTimeUtil {
    public static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");

    private static final String TIMESTAMP = "timestamp";
    private static final String TIME_ZONE = "Asia/Seoul";

    /**
     * payload 에서 타임스탬프를 추출하고 LocalDateTime 객체로 변환합니다.
     *
     * @param payload 웹훅 이벤트의 페이로드
     * @return 타임스탬프를 기반으로 생성된 LocalDateTime 객체
     */
    public static LocalDateTime extractTimestamp(Map<String, Object> payload) {
        Long timestamp = (Long) payload.get(TIMESTAMP);
        return Instant.ofEpochMilli(timestamp)
                .atZone(ZoneId.of(TIME_ZONE))
                .toLocalDateTime();
    }

    /**
     * JsonNode에서 타임스탬프를 추출하고 LocalDateTime 객체로 변환합니다.
     *
     * @param eventNode 웹훅 이벤트의 JsonNode 객체
     * @return 타임스탬프를 기반으로 생성된 LocalDateTime 객체
     */
    public static LocalDateTime extractTimestamp(JsonNode eventNode) {
        long timestamp = eventNode.path("timestamp").asLong();
        return Instant.ofEpochMilli(timestamp)
                .atZone(ZoneId.of(TIME_ZONE))
                .toLocalDateTime();
    }
}
