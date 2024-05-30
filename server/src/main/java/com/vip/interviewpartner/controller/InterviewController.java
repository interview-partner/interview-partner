package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.AiInterviewRequest;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.service.AiInterviewCreateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 인터뷰 컨트롤러 입니다. 이 컨트롤러는 인터뷰 관련 API를 처리합니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/interviews")
@Tag(name = "interviews", description = "인터뷰 API")
@Slf4j
@Validated
public class InterviewController {

    private final AiInterviewCreateService aiInterviewCreateService;

    /**
     * 인터뷰 생성 매서드입니다.
     *
     * @param customUserDetails
     * @param aiInterviewRequest aiInterviewRequest DTO
     * @return 생성된 인터뷰의 ID를 리턴합니다.
     */
    @Operation(summary = "AI 면접 생성 API",
            description = "AI 면접 생성",
            responses = {
                    @ApiResponse(responseCode = "201", description = "면접 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "S3 및 GPT API 오류", content = @Content),
            }
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<Long> createInterview(@AuthenticationPrincipal CustomUserDetails customUserDetails, @Valid @RequestBody AiInterviewRequest aiInterviewRequest) {

        Long InterviewId = aiInterviewCreateService.create(customUserDetails.getMemberId(), aiInterviewRequest);
        return ApiCommonResponse.successResponse(InterviewId);
    }

}
