package com.vip.interviewpartner.domain.question.dto.request;


import com.vip.interviewpartner.domain.question.entity.Question;
import com.vip.interviewpartner.domain.user_answer.entity.UserAnswer;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "답변 저장 요청을 위한 DTO")
public class AnswerSaveRequest {

    @NotBlank
    @Schema(description = "답변 내용", example = "Lambda는 사용하는 만큼 가격을 지불하는 형식이라 더 경제적이여서 사용했습니다.")
    private String content;

    @NotBlank
    @Schema(description = "오디오 경로", example = "audio/kzs.tts")
    private String audioPath;

    public UserAnswer toEntity(Question question){
        return new UserAnswer(
                question,
                this.content,
                this.audioPath
        );
    }

}
