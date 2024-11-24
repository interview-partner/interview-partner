package com.vip.interviewpartner.domain.member.dto;

import lombok.Getter;

/**
 * 리프레시 토큰 데이터를 나타내는 클래스입니다.
 * 이 클래스는 사용자의 리프레시 토큰과 회원 ID를 필드로 가집니다.
 */
@Getter
public class RefreshTokenData {

    private String refreshToken;
    private String memberId;

    public RefreshTokenData(final String refreshToken, final String memberId) {
        this.refreshToken = refreshToken;
        this.memberId = memberId;
    }
}
