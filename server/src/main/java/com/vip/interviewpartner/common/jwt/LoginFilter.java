package com.vip.interviewpartner.common.jwt;

import static com.vip.interviewpartner.common.constants.Constants.AUTHORIZATION_HEADER;
import static com.vip.interviewpartner.common.constants.Constants.BEARER_TOKEN_PREFIX;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_REQUEST;
import static com.vip.interviewpartner.common.exception.ErrorCode.LOGIN_FAILURE;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.LoginRequest;
import com.vip.interviewpartner.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

/**
 * 로그인 요청을 처리하는 필터입니다.
 * 이 클래스는 Spring Security의 UsernamePasswordAuthenticationFilter를 상속받아, 로그인 요청을 처리합니다.
 */
@RequiredArgsConstructor
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final ObjectMapper objectMapper = new ObjectMapper();


    /**
     * 로그인 요청을 인증합니다. 요청 본문에서 로그인 정보를 읽어와 UsernamePasswordAuthenticationToken을 생성하고, 이를 인증합니다.
     * 요청 본문이 LoginRequest 형식과 일치하지 않거나 필드가 누락된 경우, INVALID_REQUEST 에러를 발생시킵니다.
     *
     * @param request  사용자의 요청
     * @param response 서버의 응답
     * @return 인증 결과
     * @throws AuthenticationException 인증 예외가 발생할 경우
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        LoginRequest loginRequest;
        try {
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginRequest = objectMapper.readValue(messageBody, LoginRequest.class);
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                throw new CustomException(INVALID_REQUEST);
            }
        } catch (IOException e) {
            throw new CustomException(INVALID_REQUEST);
        }
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());
        return authenticationManager.authenticate(authToken);
    }

    /**
     * 로그인이 성공한 경우, 엑세스 토큰과 리프레시 토큰을 생성하고, 이를 응답에 추가합니다.
     *
     * @param request    사용자의 요청
     * @param response   서버의 응답
     * @param chain      필터 체인
     * @param authResult 인증 결과
     * @throws IOException      입출력 예외가 발생할 경우
     * @throws ServletException 서블릿 예외가 발생할 경우
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        Member member = ((CustomUserDetails) authResult.getPrincipal()).getMember();
        String accessToken = tokenService.createAccessToken(member);
        String refreshToken = tokenService.createRefreshToken(member);

        response.setHeader(AUTHORIZATION_HEADER, BEARER_TOKEN_PREFIX + accessToken);
        response.addCookie(tokenService.createRefreshTokenCookie(REFRESH_TOKEN, refreshToken));
        response.setStatus(HttpStatus.OK.value());
        sendSuccessResponse(response);
        log.info("login success");

    }

    /**
     * 로그인이 실패한 경우, LOGIN_FAILURE 에러를 발생시킵니다.
     *
     * @param request  사용자의 요청
     * @param response 서버의 응답
     * @param failed   인증 실패 예외
     * @throws IOException      입출력 예외가 발생할 경우
     * @throws ServletException 서블릿 예외가 발생할 경우
     */
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        log.info("login fail");
        throw new CustomException(LOGIN_FAILURE);
    }

    /**
     * 로그인 성공 응답을 생성하고, 이를 응답 본문에 작성합니다.
     *
     * @param response 서버의 응답
     * @throws IOException 입출력 예외가 발생할 경우
     */
    private void sendSuccessResponse(HttpServletResponse response) throws IOException {
        ApiCommonResponse<?> apiResponse = ApiCommonResponse.successWithNoContent();
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.print(new ObjectMapper().writeValueAsString(apiResponse));
        writer.flush();
    }
}
