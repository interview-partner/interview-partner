package com.vip.interviewpartner.domain.feedback.controller;

import com.vip.interviewpartner.common.aop.Login;
import com.vip.interviewpartner.common.dto.ApiCommonResponse;
import com.vip.interviewpartner.domain.feedback.dto.request.FeedbackCreateRequest;
import com.vip.interviewpartner.domain.feedback.service.FeedbackCreateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/feedbacks")
@Slf4j
public class FeedbackController implements FeedbackApi {

    private final FeedbackCreateService feedbackCreateService;

    /**
     * 피드백 생성 API입니다.
     *
     * @param request 피드백 생성 요청 정보를 담은 객체
     * @return ApiCommonResponse.successWithNoContent()
     */
    @Override
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<?> createFeedback(@Login Long memberId,
                                               @Valid @RequestBody FeedbackCreateRequest request) {
        feedbackCreateService.create(memberId, request);
        return ApiCommonResponse.successWithNoContent();
    }
}
