package com.vip.interviewpartner.dto;


import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Resume;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;


/**
 * AI Interiview 생성 요청 DTO입니다.
 */
@Getter
@AllArgsConstructor
@Schema(description = "AI 인터뷰생성 Request")
public class AiInterviewRequest {
    @Schema(description = "타이틀", example = "네이버 면접")
    private String title;

    @Schema(description = "인터뷰 타입", example = "텍스트")
    private String interviewType;

    @Schema(description = "질문 개수", example = "10")
    private int questionNumber;

    @Schema(description = "채용공고", example = "네이버 백엔드 모집합니다.")
    private String jobAdvertisement;

    @Schema(description = "이력서 ID", example = "1")
    private Long resume_id;

    @Schema(description = "멤버 ID", example = "1")
    private Long member_id;

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
