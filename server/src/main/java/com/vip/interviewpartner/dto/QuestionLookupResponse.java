package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.domain.Question;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 질문 조회 응답 DTO 클래스입니다.
 * 이 클래스는 질문 조회 API의 응답 데이터를 담고 있습니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "질문 조회 응답 DTO")
public class QuestionLookupResponse {
    @Schema(description = "질문 ID", example = "1")
    private Long id;

    @Schema(description = "질문 내용", example = "해당 프로젝트에서 Lambda를 사용한 이유는 무엇인가요?")
    private String content;

    /**
     * Question Entity -> QuestionLookupResponse DTO 변환하는 메서드입니다.
     *
     * @param question 변환할 Question 엔티티
     * @return 변환된 QuestionLookupResponse 객체
     */
    public static QuestionLookupResponse of(Question question) {
        return QuestionLookupResponse.builder()
                .id(question.getId())
                .content(question.getContent())
                .build();
    }
}
