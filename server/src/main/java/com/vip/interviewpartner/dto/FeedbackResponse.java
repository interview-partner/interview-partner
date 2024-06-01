package com.vip.interviewpartner.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vip.interviewpartner.domain.Feedback;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy.MM.dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime createdTime;

    /**
     * Feedback Entity -> FeedbackResponse DTO 변환하는 메소드입니다.
     * @param feedback 변환할 Feedback 엔티티
     * @return 변환된 FeedbackResponse 객체
     */
    public static FeedbackResponse of(Feedback feedback) {
        return new FeedbackResponse(feedback.getContent(), feedback.getCreateDate());
    }
}
