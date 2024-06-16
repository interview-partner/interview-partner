package com.vip.interviewpartner.common.exception;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

/**
 * 사용자가 인증되지 않은 상태에서 보호된 리소스에 접근하려고 할 때 처리하는 핸들러입니다.
 * 이 클래스는 Spring Security의 AuthenticationEntryPoint 인터페이스를 구현합니다.
 */
@Configuration
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    /**
     * 사용자가 인증되지 않은 상태에서 보호된 리소스에 접근하려고 할 때 호출되는 메소드입니다. 이 메소드는 AUTHENTICATION_REQUIRED 에러 코드를 가진 CustomException을 발생시킵니다.
     *
     * @param request       사용자의 요청
     * @param response      서버의 응답
     * @param authException 인증 예외
     * @throws IOException      입출력 예외가 발생할 경우
     * @throws ServletException 서블릿 예외가 발생할 경우
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        throw new CustomException(ErrorCode.AUTHENTICATION_REQUIRED);
    }
}
