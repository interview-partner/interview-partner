package com.vip.interviewpartner.controller;

import static com.vip.interviewpartner.common.constants.Constants.ACCESS;
import static com.vip.interviewpartner.common.constants.Constants.AUTHORIZATION_HEADER;
import static com.vip.interviewpartner.common.constants.Constants.BEARER_TOKEN_PREFIX;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Tag(name = "auth", description = "인증 API")
public class AuthController {

    private final TokenService tokenService;

    @Operation(summary = "토큰 재발행 API",
            description = "JWT 토큰 재발행",
            responses = {
                    @ApiResponse(responseCode = "200", description = "토큰 재발행 성공 - 헤더에 'Authorization'로 새로운 엑세스 토큰이 포함되어 있으며, " +
                            "'Set-Cookie' 헤더를 통해 새로운 리프레쉬 토큰이 쿠키로 설정됩니다.",
                            headers = {
                                    @Header(name = "Authorization", description = "Bearer [access token]", schema = @Schema(type = "string")),
                                    @Header(name = "Set-Cookie", description = "refreshToken=[token]; Path=/; HttpOnly", schema = @Schema(type = "string"))
                            }),
                    @ApiResponse(responseCode = "400", description = "유효한 요청이 아님", content = @Content),
                    @ApiResponse(responseCode = "401", description = "리프레쉬 토큰 만료, 토큰 없음, 유효하지 않는 토큰 - 사용자가 새로운 로그인을 요청해야 합니다.", content = @Content),
            }
    )
    @SecurityRequirements(value = {})
    @PostMapping("/token/reissue")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        String findRefreshToken = tokenService.getRefreshTokenFromCookie(request.getCookies());
        Map<String, String> newTokens = tokenService.reissue(findRefreshToken);
        Cookie refreshTokenCookie = tokenService.createRefreshTokenCookie(REFRESH_TOKEN, newTokens.get(REFRESH));
        response.setHeader(AUTHORIZATION_HEADER, BEARER_TOKEN_PREFIX + newTokens.get(ACCESS));
        response.addCookie(refreshTokenCookie);
        return ApiCommonResponse.successWithNoContent();
    }

    @Operation(summary = "인증 테스트 API",
            description = "테스트",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            }
    )
    @GetMapping("/test")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<String> hello(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        return ApiCommonResponse.successResponse("안녕하세요 닉네임: " + customUserDetails.getNickname() + "은 인증된 사용자 입니다.");
    }
}
