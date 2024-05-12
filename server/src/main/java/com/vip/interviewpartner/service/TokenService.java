package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.constants.Constants;
import com.vip.interviewpartner.common.jwt.JWTUtil;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.RefreshTokenData;
import com.vip.interviewpartner.repository.RefreshTokenRepository;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 토큰 관련 서비스를 제공하는 클래스입니다.
 * 이 클래스는 JWT 토큰 생성, 쿠키 생성 등의 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
public class TokenService {
    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * 주어진 회원 정보를 바탕으로 엑세스 토큰을 생성합니다.
     *
     * @param member 엑세스 토큰을 생성할 회원 정보
     * @return 생성된 엑세스 토큰
     */
    public String createAccessToken(Member member) {
        return jwtUtil.createAccessToken(member.getId(), member.getNickname(), member.getRole().name());
    }

    /**
     * 주어진 회원 정보를 바탕으로 리프레쉬 토큰을 생성하고 저장합니다.
     *
     * @param member 리프레쉬 토큰을 생성할 회원 정보
     * @return 생성된 리프레쉬 토큰
     */
    public String createRefreshToken(Member member) {
        String refreshToken = jwtUtil.createRefreshToken(member.getId(), member.getNickname(), member.getRole().name());
        refreshTokenRepository.save(new RefreshTokenData(refreshToken, String.valueOf(member.getId())));
        return refreshToken;
    }

    /**
     * 주어진 키와 값으로 쿠키를 생성합니다.
     *
     * @param key 쿠키의 키
     * @param value 쿠키의 값
     * @return 생성된 쿠키
     */
    public Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(Constants.COOKIE_REFRESH_EXPIRATION_SECONDS);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        // cookie.setSecure(true); // HTTPS 사용 시 주석 해제
        return cookie;
    }

}

