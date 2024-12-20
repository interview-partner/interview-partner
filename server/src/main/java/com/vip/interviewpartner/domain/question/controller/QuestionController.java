package com.vip.interviewpartner.domain.question.controller;


import com.vip.interviewpartner.common.aop.Login;
import com.vip.interviewpartner.common.dto.ApiCommonResponse;
import com.vip.interviewpartner.domain.question.dto.request.AnswerSaveRequest;
import com.vip.interviewpartner.domain.question.dto.response.AudioAnswerResponse;
import com.vip.interviewpartner.domain.member.dto.CustomUserDetails;
import com.vip.interviewpartner.domain.question.dto.response.TailQuestionResponse;
import com.vip.interviewpartner.domain.user_answer.service.AnswerSaveService;
import com.vip.interviewpartner.domain.question.service.TailQuestionCreateService;
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
import org.springframework.web.multipart.MultipartFile;

/**
 * 질문 컨트롤러 입니다. 이 컨트롤러는 질문 관련 API를 처리합니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/questions")
@Tag(name = "questions", description = "질문 API")
@Slf4j
@Validated
public class QuestionController {

    private final AnswerSaveService answerSaveService;
    private final TailQuestionCreateService tailQuestionCreateService;

    @Operation(summary = "질문에 대한 답변 저장 API",
            description = "질문에 대한 답변 저장",
            responses = {
                    @ApiResponse(responseCode = "201", description = "질문에 대한 답변 저장 성공"),
                    @ApiResponse(responseCode = "400", description = "질문에 대한 답변 저장 오류", content = @Content),
                    @ApiResponse(responseCode = "403", description = "요청자 소유자 불일치 오류", content = @Content),
            }
    )
    @PostMapping("/{questionId}/answers")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<?> saveAnswer(@Login Long memberId,
                                           @NotNull(message = "질문 아이디는 필수입니다.") @PathVariable Long questionId,
                                           @Valid @RequestBody AnswerSaveRequest answerSaveRequest) {

        answerSaveService.saveAnswer(memberId, questionId, answerSaveRequest);
        return ApiCommonResponse.successWithNoContent();
    }

    @Operation(summary = "질문에 대한 음성 답변 저장 API",
            description = "질문에 대한 음성 답변을 텍스트로 변환하여 저장. 음성 파일은 WAV, LINEAR16, 1분 미만",
            responses = {
                    @ApiResponse(responseCode = "201", description = "질문에 대한 음성 답변 저장 성공"),
                    @ApiResponse(responseCode = "400", description = "질문에 대한 음성 답변 저장 오류(1분 초과)", content = @Content),
                    @ApiResponse(responseCode = "403", description = "요청자 소유자 불일치 오류", content = @Content),
                    @ApiResponse(responseCode = "415", description = "지원하지 않는 파일 형식", content = @Content),
                    @ApiResponse(responseCode = "500", description = "STT 중 오류", content = @Content),
            }
    )
    @PostMapping("/{questionId}/audio-answers")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<AudioAnswerResponse> saveAudioAnswer(@Login Long memberId,
                                                                  @NotNull(message = "질문 아이디는 필수입니다.") @PathVariable Long questionId,
                                                                  @RequestParam("file") MultipartFile audioFile) {
        AudioAnswerResponse audioAnswerResponse = answerSaveService.saveAudioAnswer(memberId, questionId, audioFile);
        return ApiCommonResponse.successResponse(audioAnswerResponse);
    }

    /**
     * 꼬리 질문을 생성하는 API 입니다.
     *
     * @param customUserDetails 유저 정보
     * @param questionId 전 질문 ID
     * @return 꼬리질문 내용
     */
    @Operation(summary = "꼬리 질문 생성 API",
            description = "기존 질문과 답변을 보고 꼬리 질문을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "꼬리 질문 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "질문이 유효하지 않음", content = @Content),
            }
    )
    @PostMapping("/{questionId}/tails")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<TailQuestionResponse> createTailQuestion(@Login Long memberId, @PathVariable Long questionId) {

        TailQuestionResponse tailQuestionResponse = tailQuestionCreateService.createTailQuestion(memberId, questionId);
        return ApiCommonResponse.successResponse(tailQuestionResponse);
    }
}
