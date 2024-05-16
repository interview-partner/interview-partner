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
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

@Slf4j
@RequiredArgsConstructor
@Configuration
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final TokenService tokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Member member = ((CustomUserDetails) authentication.getPrincipal()).getMember();
        String refresh = tokenService.createRefreshToken(member);
        response.addCookie(tokenService.createRefreshTokenCookie(REFRESH_TOKEN, refresh, COOKIE_REFRESH_EXPIRATION_SECONDS));
        response.sendRedirect("http://localhost:3000/token/reissue"); // 임의로 지정(추후 변경)
        log.info("social login success");
    }
}
