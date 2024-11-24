package com.vip.interviewpartner.domain.member.dto.response;

import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.member.entity.Member;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원정보 조회 응답 DTO 클래스입니다.
 * 이 클래스는 회원정보 조회 API의 응답 데이터를 담고 있습니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "회원정보 조회 응답 DTO")
public class MemberInfoResponse {
    @Schema(description = "회원의 고유 ID", example = "1")
    private Long id;

    @Schema(description = "회원 이메일(로그인 ID)", example = "user@example.com")
    private String email;

    @Schema(description = "회원 닉네임", example = "nickname")
    private String nickname;

    @Schema(description = "회원 가입일", example = "2024.05.24 14:30")
    private String createdDate;

    /**
     * Member Entity -> MemberInfoResponse DTO 변환하는 메서드입니다.
     *
     * @param member 변환할 Member 엔티티
     * @return 변환된 MemberInfoResponse 객체
     */
    public static MemberInfoResponse of(Member member) {
        return MemberInfoResponse.builder()
                .id(member.getId())
                .email(member.getEmail())
                .nickname(member.getNickname())
                .createdDate(member.getCreateDate().format(DateTimeUtil.FORMATTER))
                .build();
    }

}
