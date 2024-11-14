package com.vip.interviewpartner.domain.room.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 방 입장 요청을 위한 DTO 클래스입니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "방 입장 요청 DTO")
public class RoomEnterRequest {
    @Schema(description = "이력서 ID", example = "이력서 고유 ID")
    private Long resumeId;
}
