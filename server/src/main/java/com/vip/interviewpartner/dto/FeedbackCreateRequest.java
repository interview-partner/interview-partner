package com.vip.interviewpartner.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "피드백 생성 요청을 위한 DTO")
public class FeedbackCreateRequest {
    @NotNull
    @Schema(description = "보내는 사용자의 참여자 ID", example = "1")
    private Long senderParticipantId;

    @NotNull
    @Schema(description = "받는 사용자의 참여자 ID", example = "2")
    private Long receiverParticipantId;

    @NotBlank
    @Schema(description = "피드백 내용", example = "전체적으로 답변을 조금 더 구체적으로 하시면 좋을 것 같아요.")
    private String content;
}
