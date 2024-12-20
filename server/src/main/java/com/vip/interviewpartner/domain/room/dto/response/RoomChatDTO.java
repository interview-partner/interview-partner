package com.vip.interviewpartner.domain.room.dto.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

/**
 * RoomChatDTO 클래스는 채팅 메시지의 데이터 전송 객체입니다.
 */
@Getter
@Slf4j
@ToString
public class RoomChatDTO {
    private Long roomParticipantId;
    private String content;
    private String nickname;

    /**
     * JSON 문자열을 RoomChatDTO 객체로 변환합니다.
     *
     * @param json JSON 문자열
     * @return RoomChatDTO 객체
     * @throws CustomException JSON 문자열을 객체로 변환하는 데 실패한 경우 발생
     */
    public static RoomChatDTO fromJson(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(json, RoomChatDTO.class);
        } catch (JsonProcessingException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }
}
