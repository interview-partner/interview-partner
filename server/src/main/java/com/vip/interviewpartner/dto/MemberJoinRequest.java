package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.domain.Member;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원가입 요청을 처리하기 위한 DTO 클래스입니다.
 * 이 클래스는 회원가입에 필요한 이메일, 비밀번호, 닉네임을 포함합니다.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "회원가입 요청 DTO")
public class MemberJoinRequest {

    @Schema(description = "이메일", example = "user@example.com")
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @Schema(description = "비밀번호", example = "yourpassword")
    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, max = 12, message = "비밀번호는 8자 이상, 12자 이하여야 합니다.")
    private String password;

    @Schema(description = "닉네임", example = "nickname12")
    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(min = 2, max = 10, message = "닉네임은 2자 이상, 10자 이하여야 합니다.")
    private String nickname;

    /**
     * MemberJoinRequest -> Member 엔티티로 변환합니다.
     *
     * @param encodePassword 암호화된 비밀번호
     * @return Member 엔티티
     */
    public Member toEntity(String encodePassword) {
        return Member.regularMemberBuilder()
                .email(email)
                .password(encodePassword)
                .nickname(nickname)
                .build();
    }
}
