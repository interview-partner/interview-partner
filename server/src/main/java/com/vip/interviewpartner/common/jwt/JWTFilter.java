package com.vip.interviewpartner.common.jwt;

import static com.vip.interviewpartner.common.constants.Constants.ACCESS;
import static com.vip.interviewpartner.common.constants.Constants.AUTHORIZATION_HEADER;
import static com.vip.interviewpartner.common.constants.Constants.BEARER_TOKEN_PREFIX;
import static com.vip.interviewpartner.common.exception.ErrorCode.ACCESS_TOKEN_EXPIRED;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_REQUEST;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_TOKEN;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Role;
import com.vip.interviewpartner.dto.CustomUserDetails;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JWT 토큰을 검증하고 인증하는 필터입니다.
 * 이 클래스는 Spring의 OncePerRequestFilter를 상속받아, 요청당 한 번만 실행되도록 합니다.
 */
@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    /**
     * 필터 체인을 실행하고, 발생하는 예외를 처리합니다. Authorization 헤더를 검증하고, JWT 토큰을 검증하여 인증합니다. JWT 토큰이 만료되었거나 유효하지 않은 경우, 에러를 발생시킵니다.
     *
     * @param request     사용자의 요청
     * @param response    서버의 응답
     * @param filterChain 필터 체인
     * @throws ServletException 서블릿 예외가 발생할 경우
     * @throws IOException      입출력 예외가 발생할 경우
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader(AUTHORIZATION_HEADER);

        if (authorization == null || !authorization.startsWith(BEARER_TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = authorization.split(" ")[1];

        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            throw new CustomException(ACCESS_TOKEN_EXPIRED);
        } catch (JwtException e) {
            throw new CustomException(INVALID_TOKEN);
        } catch (Exception e) {
            throw new CustomException(INVALID_REQUEST);
        }

        String category = jwtUtil.getCategory(accessToken);

        if (!category.equals(ACCESS)) {
            throw new CustomException(INVALID_REQUEST);
        }

        Long id = jwtUtil.getId(accessToken);
        String nickname = jwtUtil.getNickname(accessToken);
        String role = jwtUtil.getRole(accessToken);
        Member member = new Member(id, nickname, Role.valueOf(role));

        CustomUserDetails customUserDetails = new CustomUserDetails(member);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
