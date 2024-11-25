//package com.vip.interviewpartner.common.oauth2;
//
//import static com.vip.interviewpartner.common.constants.Constants.COOKIE_REFRESH_EXPIRATION_SECONDS;
//import static com.vip.interviewpartner.common.constants.Constants.ID_TOKEN;
//import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.vip.interviewpartner.common.exception.CustomException;
//import com.vip.interviewpartner.common.exception.ErrorCode;
//import com.vip.interviewpartner.common.util.ResponseFilterUtil;
//import com.vip.interviewpartner.domain.member.entity.Member;
//import com.vip.interviewpartner.domain.member.dto.GoogleResponse;
//import com.vip.interviewpartner.domain.member.service.CustomOAuth2UserService;
//import com.vip.interviewpartner.domain.member.service.TokenService;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.ServletInputStream;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.nio.charset.StandardCharsets;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpMethod;
//import org.springframework.util.StreamUtils;
//import org.springframework.web.filter.OncePerRequestFilter;
//
///**
// * FirebaseTokenFilter는 Firebase를 통한 Google OAuth2 로그인을 처리하는 필터입니다.
// * POST 요청을 통해 전달된 idToken을 검증하고, 이를 통해 사용자 정보를 생성하거나 조회한 후
// * JWT 액세스 토큰과 리프레시 토큰을 생성하여 응답에 포함시킵니다.
// */
//@RequiredArgsConstructor
//@Slf4j
//public class FirebaseTokenFilter extends OncePerRequestFilter {
//
//    public static final String GOOGLE_LOGIN_URI = "/api/v1/auth/login/firebase/google";
//
//    private final TokenService tokenService;
//    private final CustomOAuth2UserService customOAuth2UserService;
//
//    /**
//     * 요청이 Firebase 로그인을 위한 POST 요청인지 확인하고, 해당 요청일 경우 idToken을 처리하여 JWT 토큰을 생성하고 응답에 포함시킵니다.
//     *
//     * @param request  HttpServletRequest 객체
//     * @param response HttpServletResponse 객체
//     * @param chain    FilterChain 객체
//     * @throws ServletException 서블릿 예외가 발생할 경우
//     * @throws IOException      입출력 예외가 발생할 경우
//     */
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
//        if (isFirebaseLoginRequest(request)) {
//            String idToken;
//            try {
//                ServletInputStream inputStream = request.getInputStream();
//                String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
//                idToken = new ObjectMapper().readTree(messageBody).get(ID_TOKEN).asText();
//            } catch (Exception e) {
//                throw new CustomException(ErrorCode.INVALID_REQUEST);
//            }
//            GoogleResponse googleResponse = new GoogleResponse(idToken);
//            Member member = customOAuth2UserService.findOrCreateMember(googleResponse);
//            String accessToken = tokenService.createAccessToken(member);
//            String refreshToken = tokenService.createRefreshToken(member);
//            Cookie refreshTokenCookie = tokenService.createRefreshTokenCookie(REFRESH_TOKEN, refreshToken, COOKIE_REFRESH_EXPIRATION_SECONDS);
//            ResponseFilterUtil.addJwtTokensToResponse(response, accessToken, refreshTokenCookie);
//            log.info("google login success");
//        } else {
//            chain.doFilter(request, response);
//        }
//    }
//
//    /**
//     * 요청이 Firebase 로그인을 위한 POST 요청인지 확인합니다.
//     *
//     * @param request HttpServletRequest 객체
//     * @return Firebase 로그인 요청 여부
//     */
//    private boolean isFirebaseLoginRequest(HttpServletRequest request) {
//        return HttpMethod.POST.matches(request.getMethod()) && GOOGLE_LOGIN_URI.equals(request.getRequestURI());
//    }
//}
