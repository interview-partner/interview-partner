package com.vip.interviewpartner.domain.question.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "음성 답변 저장 응답을 위한 DTO")
public class AudioAnswerResponse {

    @Schema(description = "변환된 텍스트", example = "이것은 변환된 텍스트입니다.")
    private String transcript;

    @Schema(description = "오디오 파일 경로", example = "audio/answer/example.mp3")
    private String audioPath;
}
