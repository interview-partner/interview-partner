package com.vip.interviewpartner.common.util;

import static com.vip.interviewpartner.common.constants.Constants.AUTHORIZATION_HEADER;
import static com.vip.interviewpartner.common.constants.Constants.BEARER_TOKEN_PREFIX;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.dto.ApiCommonResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import org.springframework.http.HttpStatus;

public class ResponseFilterUtil {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static void addJwtTokensToResponse(HttpServletResponse response, String accessToken, Cookie refreshTokenCookie) throws IOException {
        response.setHeader(AUTHORIZATION_HEADER, BEARER_TOKEN_PREFIX + accessToken);
        response.addCookie(refreshTokenCookie);
        response.setStatus(HttpStatus.OK.value());
        ResponseFilterUtil.sendSuccessResponse(response);
    }
    public static void sendSuccessResponse(HttpServletResponse response) throws IOException {
        ApiCommonResponse<?> apiResponse = ApiCommonResponse.successWithNoContent();
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.print(objectMapper.writeValueAsString(apiResponse));
        writer.flush();
    }
}
