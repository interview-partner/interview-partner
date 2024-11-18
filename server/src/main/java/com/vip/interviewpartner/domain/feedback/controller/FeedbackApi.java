package com.vip.interviewpartner.domain.feedback.controller;

import com.vip.interviewpartner.common.aop.Login;
import com.vip.interviewpartner.common.dto.ApiCommonResponse;
import com.vip.interviewpartner.domain.feedback.dto.request.FeedbackCreateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Tag(name = "feedbacks", description = "피드백 API")
public interface FeedbackApi {
    @Operation(summary = "피드백 생성 API",
            description = "사용자가 모의면접 간 다른 사용자에게 피드백을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "피드백 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "유효한 형식 및 요청이 아님, 해당 참가자를 찾지 못하는 경우", content = @Content),
                    @ApiResponse(responseCode = "409", description = "동일한 참가자한테 이미 피드백을 한 경우", content = @Content),
            }
    )
    @ResponseStatus(HttpStatus.CREATED)
    ApiCommonResponse<?> createFeedback(@Login Long memberId,
                                               @Valid @RequestBody FeedbackCreateRequest request);
}
