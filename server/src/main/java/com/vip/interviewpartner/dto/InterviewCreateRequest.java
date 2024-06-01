package com.vip.interviewpartner.dto;


import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Resume;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;


/**
 * AI Interiview 생성 요청 DTO입니다.
 */
@Getter
@AllArgsConstructor
@Schema(description = "AI 인터뷰생성 Request")
public class InterviewCreateRequest {
    @NotBlank(message = "타이틀은 필수입니다.")
    @Schema(description = "타이틀", example = "네이버 면접")
    private String title;

    @NotBlank(message = "인터뷰 타입은 필수입니다.")
    @Schema(description = "인터뷰 타입", example = "텍스트")
    private String interviewType;

    @Min(value = 1, message = "질문 개수는 1개 이상이어야 합니다.")
    @Max(value = 10, message = "질문 개수는 10 이하여야 합니다.")
    @Schema(description = "질문 개수", example = "10")
    private int questionNumber;

    @Schema(description = "채용공고", example = "네이버 백엔드 모집합니다.")
    private String jobAdvertisement;

    @NotNull(message = "이력서 ID는 필수입니다.")
    @Schema(description = "이력서 ID", example = "1")
    private Long resumeId;

    public Interview toEntity(Member member, Resume resume){
        return new Interview(
                member,
                resume,
                this.interviewType,
                this.jobAdvertisement,
                this.title
        );
    }

}
