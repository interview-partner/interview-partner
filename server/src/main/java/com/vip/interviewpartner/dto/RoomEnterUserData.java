package com.vip.interviewpartner.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * RoomEnterUserData 클래스는 사용자가 방에 입장할 때 필요한 데이터를 담는 DTO입니다.
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
@Getter
public class RoomEnterUserData {
    private Long memberId;
    private String nickname;
    private String resumeUrl;

    /**
     * RoomEnterUserData 객체를 JSON 문자열로 변환합니다.
     *
     * @return 객체의 JSON 표현
     * @throws CustomException 객체를 JSON으로 변환하는 데 실패한 경우 발생
     */
    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }
}
