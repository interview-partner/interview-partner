package com.vip.interviewpartner.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j
@ToString
public class RoomChatDTO {
    private Long memberId;
    private Long roomId;
    private String content;

    /**
     * JSON 문자열을 RoomChatDTO 객체로 변환합니다.
     *
     * @param json JSON 문자열
     * @return RoomChatDTO 객체
     * @throws CustomException JSON 문자열을 객체로 변환하는 데 실패한 경우 발생
     */
    public static RoomChatDTO fromJson(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        try {
            return objectMapper.readValue(json, RoomChatDTO.class);
        } catch (JsonProcessingException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }
}
