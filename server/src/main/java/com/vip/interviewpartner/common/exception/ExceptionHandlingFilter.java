package com.vip.interviewpartner.common.exception;

import static com.vip.interviewpartner.common.exception.ErrorCode.SERVER_ERROR;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.dto.ApiCommonResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * 예외 처리를 위한 필터입니다.
 * 이 클래스는 Spring의 OncePerRequestFilter를 상속받아, 요청당 한 번만 실행되도록 합니다.
 */
@RequiredArgsConstructor
public class ExceptionHandlingFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    /**
     * 필터 체인을 실행하고, 발생하는 예외를 처리합니다. CustomException이 발생하면 해당 예외의 상태 코드와 메시지를 사용하여 에러 응답을 생성합니다. 그 외의 예외가 발생하면 SERVER_ERROR의 상태 코드와 메시지를 사용하여 에러 응답을 생성합니다.
     *
     * @param request     사용자의 요청
     * @param response    서버의 응답
     * @param filterChain 필터 체인
     * @throws ServletException 서블릿 예외가 발생할 경우
     * @throws IOException      입출력 예외가 발생할 경우
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (CustomException e) {
            handleErrorResponse(response, e.getErrorCode().getStatus(), e.getErrorCode().getMessage());
        } catch (Exception e) {
            handleErrorResponse(response, SERVER_ERROR.getStatus(), SERVER_ERROR.getMessage());
        }
    }

    /**
     * 에러 응답을 생성하고, 이를 JSON 형식으로 변환하여 응답 본문에 작성합니다. 이 메소드는 주어진 상태 코드와 메시지를 사용하여 ApiCommonResponse를 생성하고, 이를 JSON으로 변환합니다.
     *
     * @param response 서버의 응답
     * @param status   상태 코드
     * @param message  메시지
     * @throws IOException 입출력 예외가 발생할 경우
     */
    private void handleErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(status);
        String apiResponseJson = objectMapper.writeValueAsString(ApiCommonResponse.errorResponse(message));
        PrintWriter writer = response.getWriter();
        writer.print(apiResponseJson);
        writer.flush();
    }
}
