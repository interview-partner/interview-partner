package com.vip.interviewpartner.common.oauth2;

import static com.vip.interviewpartner.common.constants.Constants.*;

import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.service.TokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

/**
 * CustomSuccessHandler는 OAuth2 인증 성공 시 실행되는 핸들러로,
 * 사용자 정보를 바탕으로 리프레시 토큰을 생성하고 이를 쿠키에 추가하여 클라이언트에 반환합니다.
 */
@Slf4j
@RequiredArgsConstructor
@Configuration
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Value("${oauth2.redirect.success-url}")
    private String oauth2RedirectSuccessUrl;

    private final TokenService tokenService;

    /**
     * 인증 성공 시 실행되는 메서드로, 사용자 정보를 기반으로 리프레시 토큰을 생성하고,
     * 이를 쿠키에 추가하여 클라이언트에 반환합니다. 또한, 클라이언트를 특정 URL로 리다이렉트합니다.
     *
     * @param request  HttpServletRequest 객체
     * @param response HttpServletResponse 객체
     * @param authentication 인증 객체
     * @throws IOException 예외 처리
     * @throws ServletException 예외 처리
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Member member = ((CustomUserDetails) authentication.getPrincipal()).getMember();
        String refresh = tokenService.createRefreshToken(member);
        response.addCookie(tokenService.createRefreshTokenCookie(REFRESH_TOKEN, refresh, COOKIE_REFRESH_EXPIRATION_SECONDS));
        response.sendRedirect(oauth2RedirectSuccessUrl);
        log.info("social login success");
    }
}
