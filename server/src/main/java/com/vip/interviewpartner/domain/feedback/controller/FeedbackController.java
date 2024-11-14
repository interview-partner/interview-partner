package com.vip.interviewpartner.domain.feedback.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.domain.member.dto.CustomUserDetails;
import com.vip.interviewpartner.domain.feedback.dto.request.FeedbackCreateRequest;
import com.vip.interviewpartner.domain.feedback.service.FeedbackCreateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/feedbacks")
@Tag(name = "feedbacks", description = "피드백 API")
@Slf4j
public class FeedbackController {

    private final FeedbackCreateService feedbackCreateService;

    /**
     * 피드백 생성 API입니다.
     *
     * @param customUserDetails 사용자 인증 정보
     * @param request 피드백 생성 요청 정보를 담은 객체
     * @return ApiCommonResponse.successWithNoContent()
     */
    @Operation(summary = "피드백 생성 API",
            description = "사용자가 모의면접 간 다른 사용자에게 피드백을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "피드백 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "유효한 형식 및 요청이 아님, 해당 참가자를 찾지 못하는 경우", content = @Content),
                    @ApiResponse(responseCode = "409", description = "동일한 참가자한테 이미 피드백을 한 경우", content = @Content),
            }
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<?> createFeedback(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                               @Valid @RequestBody FeedbackCreateRequest request) {
        feedbackCreateService.createFeedback(customUserDetails.getMemberId(), request);
        return ApiCommonResponse.successWithNoContent();
    }
}
