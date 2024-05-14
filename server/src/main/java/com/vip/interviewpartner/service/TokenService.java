package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.constants.Constants.ACCESS;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_TOKEN;
import static com.vip.interviewpartner.common.exception.ErrorCode.REFRESH_TOKEN_NOT_EXIST;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.jwt.JWTUtil;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.RefreshTokenData;
import com.vip.interviewpartner.repository.RefreshTokenRepository;
import jakarta.servlet.http.Cookie;
import java.util.Map;
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
     * @param key   쿠키의 키
     * @param value 쿠키의 값
     * @param maxAge 쿠키의 만료 시간
     * @return 생성된 쿠키
     */
    public Cookie createRefreshTokenCookie(String key, String value, int maxAge) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        // cookie.setSecure(true); // HTTPS 사용 시 주석 해제
        return cookie;
    }

    /**
     * 주어진 쿠키 배열에서 'refreshToken' 쿠키를 찾아 반환하는 메소드입니다.
     *
     * @param cookies 클라이언트로부터 받은 쿠키 배열
     * @return 찾은 'refreshToken' 쿠키
     * @throws CustomException 'refreshToken' 쿠키가 없는 경우, cookies[]이 null인 경우
     */
    public String getRefreshTokenFromCookie(Cookie[] cookies) {
        if (cookies == null) {
            throw new CustomException(REFRESH_TOKEN_NOT_EXIST);
        }
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(REFRESH_TOKEN)) {
                return cookie.getValue();
            }
        }
        throw new CustomException(REFRESH_TOKEN_NOT_EXIST);
    }

    /**
     * 주어진 리프레쉬 토큰을 바탕으로 새로운 엑세스 토큰과 리프레쉬 토큰을 발급하는 메소드입니다.
     * 이 메소드는 주어진 리프레쉬 토큰의 유효성을 검증하고, 새로운 엑세스 토큰과 리프레쉬 토큰을 생성합니다.
     * 기존의 리프레쉬 토큰을 Redis에서 삭제하고 새로운 리프레쉬 토큰을 저장합니다.
     *
     * @param findRefreshToken 유효성을 검증할 리프레쉬 토큰
     * @return 새로 생성된 엑세스 토큰과 리프레쉬 토큰을 담은 Map 객체
     * @throws CustomException 리프레쉬 토큰이 유효하지 않은 경우, 리프레쉬 토큰이 존재하지 않는 경우
     */
    public Map<String, String> reissue(String findRefreshToken) {
        jwtUtil.validateToken(findRefreshToken, REFRESH);
        String memberId = refreshTokenRepository.findByRefreshToken(findRefreshToken).orElseThrow(() -> new CustomException(INVALID_TOKEN)).getMemberId();
        String nickname = jwtUtil.getNickname(findRefreshToken);
        String role = jwtUtil.getRole(findRefreshToken);

        String newAccessToken = jwtUtil.createAccessToken(Long.valueOf(memberId), nickname, role);
        String newRefreshToken = jwtUtil.createRefreshToken(Long.valueOf(memberId), nickname, role);

        refreshTokenRepository.deleteByRefreshToken(findRefreshToken);
        refreshTokenRepository.save(new RefreshTokenData(newRefreshToken, memberId));
        return Map.of(ACCESS, newAccessToken, REFRESH, newRefreshToken);
    }
}

