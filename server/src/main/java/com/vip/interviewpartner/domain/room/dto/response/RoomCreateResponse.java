package com.vip.interviewpartner.domain.room.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 방 생성의 응답을 위한 DTO 클래스입니다.
 */
@Getter
@AllArgsConstructor
@Schema(description = "방 생성의 응답 DTO")
public class RoomCreateResponse {
    @Schema(description = "생성된 방 번호")
    private Long roomId;
}
