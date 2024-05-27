package com.vip.interviewpartner.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 방 입장의 응답을 위한 DTO 클래스입니다.
 */
@Getter
@AllArgsConstructor
@Schema(description = "방 입장의 응답 DTO")
public class RoomEnterResponse {
    @Schema(description = "입장을 위한 토큰")
    private String token;
}
