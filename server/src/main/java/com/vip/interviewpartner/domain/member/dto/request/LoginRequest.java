package com.vip.interviewpartner.domain.member.dto.request;

import lombok.Getter;

/**
 * 로그인 요청을 나타내는 클래스입니다.
 * 이 클래스는 사용자의 이메일과 비밀번호를 필드로 가집니다.
 */
@Getter
public class LoginRequest {
    private String email;
    private String password;
}
