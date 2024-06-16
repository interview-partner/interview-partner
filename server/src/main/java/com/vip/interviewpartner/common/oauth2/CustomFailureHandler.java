package com.vip.interviewpartner.common.oauth2;

import static com.vip.interviewpartner.common.exception.ErrorCode.*;

import com.vip.interviewpartner.common.exception.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

/**
 * CustomFailureHandler는 OAuth2 인증 실패 시 실행되는 핸들러로,
 * 실패한 인증 요청을 처리하고 클라이언트를 특정 URL로 리다이렉트합니다.
 */
@Slf4j
@Component
public class CustomFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final String DEFAULT_ERROR = "login-failed";

    @Value("${oauth2.redirect.failure-url}")
    private String oauth2RedirectFailureUrl;

    /**
     * 인증 실패 시 실행되는 메서드로, 실패한 인증 요청을 처리하고 클라이언트를 특정 URL로 리다이렉트합니다.
     *
     * @param request  HttpServletRequest 객체
     * @param response HttpServletResponse 객체
     * @param exception 인증 실패 시 발생하는 AuthenticationException 객체
     * @throws IOException 예외 처리
     * @throws ServletException 예외 처리
     */
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String errorCode = determineErrorCode(exception);
        String redirectUrl = oauth2RedirectFailureUrl + errorCode;
        response.sendRedirect(redirectUrl);
        log.info("social login failure");
    }

    /**
     * 예외 객체를 분석하여 에러 코드를 결정합니다.
     *
     * @param exception 인증 실패 시 발생하는 AuthenticationException 객체
     * @return 에러 코드 문자열
     */
    private String determineErrorCode(AuthenticationException exception) {
        if (exception instanceof OAuth2AuthenticationException) {
            OAuth2AuthenticationException oauthException = (OAuth2AuthenticationException) exception;
            OAuth2Error error = oauthException.getError();
            if (error.getErrorCode().equals(DUPLICATE_EMAIL.name())) {
                return DUPLICATE_EMAIL.name().toLowerCase().replace("_", "-");
            }
        }
        return DEFAULT_ERROR;
    }
}
