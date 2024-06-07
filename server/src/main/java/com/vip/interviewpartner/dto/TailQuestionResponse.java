package com.vip.interviewpartner.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * 꼬리 질문 생성 응답 객체입니다.
 */
@Getter
@Slf4j
@AllArgsConstructor
@Schema(description = "꼬리 질문 응답 DTO")
public class TailQuestionResponse {
    @Schema(description = "꼬리 질문 내용", example = "해당 답변에서 Lambda를 경제적이여서 사용한다 했는데 다른 경제적 방법도 고려하셨나요?")
    private String content;

}
