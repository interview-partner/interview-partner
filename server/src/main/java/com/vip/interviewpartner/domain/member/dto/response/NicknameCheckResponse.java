package com.vip.interviewpartner.domain.member.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 닉네임 중복 확인을 위한 응답 DTO
 * 사용자가 선택한 닉네임의 중복 여부를 확인하고, 그 결과를 반환하는 데 사용됩니다.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "닉네임 중복 여부 응답 DTO")
public class NicknameCheckResponse {
    @Schema(description = "닉네임 이용 가능 여부")
    private boolean isNicknameAvailable;
}
