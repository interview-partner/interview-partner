package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.Feedback;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 피드백 응답 DTO 입니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "피드백 응답 DTO")
public class FeedbackResponse {
    @Schema(description = "피드백 내용", example = "답변을 전체적으로 자세히 답변하셔야 할 것 같습니다.")
    private String content;

    @Schema(description = "피드백 날짜", example = "2024.05.24 14:30")
    private String createdTime;

    /**
     * Feedback Entity -> FeedbackResponse DTO 변환하는 메소드입니다.
     *
     * @param feedback 변환할 Feedback 엔티티
     * @return 변환된 FeedbackResponse 객체
     */
    public static FeedbackResponse of(Feedback feedback) {
        return new FeedbackResponse(feedback.getContent(), feedback.getCreateDate().format(DateTimeUtil.FORMATTER));
    }
}
