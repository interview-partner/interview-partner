package com.vip.interviewpartner.domain.interview.controller;

import com.vip.interviewpartner.common.aop.Login;
import com.vip.interviewpartner.common.dto.ApiCommonResponse;
import com.vip.interviewpartner.domain.interview.dto.request.InterviewCreateRequest;
import com.vip.interviewpartner.domain.member.dto.CustomUserDetails;
import com.vip.interviewpartner.domain.interview.dto.response.InterviewLookupResponse;
import com.vip.interviewpartner.domain.question.dto.response.QuestionLookupResponse;
import com.vip.interviewpartner.domain.interview.service.InterviewCreateService;
import com.vip.interviewpartner.domain.interview.service.InterviewService;
import com.vip.interviewpartner.domain.question.service.QuestionLookupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    private final InterviewCreateService interviewCreateService;
    private final QuestionLookupService questionLookupService;
    private final InterviewService interviewService;

    /**
     * 인터뷰 생성 매서드입니다.
     *
     * @param customUserDetails
     * @param interviewCreateRequest aiInterviewRequest DTO
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
    public ApiCommonResponse<Long> createInterview(@Login Long memberId, @Valid @RequestBody InterviewCreateRequest interviewCreateRequest) {

        Long InterviewId = interviewCreateService.create(memberId, interviewCreateRequest);
        return ApiCommonResponse.successResponse(InterviewId);
    }


    /**
     * 질문 조회 API 입니다.
     *
     * @param interviewId 질문을 조회하고자 하는 인터뷰의 아이디 입니다.
     * @return ApiCommonResponse<List<QuestionLookupResponse>> 조회된 질문 리스트 응답 객체
     */
    @Operation(summary = "이력서 질문 조회 API",
            description = "현재 인터뷰 방의 질문들을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "질문 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "질문이 존재하지 않습니다", content = @Content),
                    @ApiResponse(responseCode = "403", description = "요청자와 인터뷰의 소유자가 일치하지 않습니다", content = @Content),
            }
    )
    @GetMapping("/{interviewId}/questions")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<List<QuestionLookupResponse>> getQuestions(@Login Long memberId, @NotNull(message = "인터뷰 아이디는 필수입니다.") @PathVariable Long interviewId) {
        List<QuestionLookupResponse> questions = questionLookupService.getQuestionsByInterviewId(memberId, interviewId);
        return ApiCommonResponse.successResponse(questions);
    }

    /**
     * 인터뷰 조회 API 입니다.
     *
     * @param interviewId 조회하고자 하는 인터뷰의 아이디 입니다.
     * @return ApiCommonResponse<InterviewLookupResponse> 조회된 인터뷰 응답 객체
     */
    @Operation(summary = "인터뷰 조회 API",
            description = "현재 인터뷰 ID의 인터뷰를 조회하고 PromptRoom에 필요한 정보를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "인터뷰 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "인터뷰 요청 오류", content = @Content),
                    @ApiResponse(responseCode = "403", description = "요청자와 인터뷰의 소유자가 일치하지 않습니다", content = @Content),
            }
    )
    @GetMapping("/{interviewId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<InterviewLookupResponse> getInterview(@Login Long memberId, @NotNull(message = "인터뷰 아이디는 필수입니다.") @PathVariable Long interviewId) {
        InterviewLookupResponse interviewLookupResponse = interviewService.getInterviewById(memberId, interviewId);
        return ApiCommonResponse.successResponse(interviewLookupResponse);
    }

}
