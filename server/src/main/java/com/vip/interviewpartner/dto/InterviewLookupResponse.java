package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.domain.Interview;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI면접 설정에서 프롬프트 방으로 넘어갈 때 인터뷰 조회 응답 DTO")
public class InterviewLookupResponse {
    @Schema(description = "인터뷰 ID", example = "1")
    private Long interviewId;

    @Schema(description = "인터뷰 제목", example = "네이버 면접 인터뷰")
    private String title;

    @Schema(description = "인터뷰 타입", example = "텍스트")
    private String interviewType;

    @Schema(description = "이력서 파일 이름", example = "backendDevResume.pdf")
    private String resumeFileName;

    @Schema(description = "인터뷰 생성 날짜", example = "2024-05-22 14:19")
    private String createDate;

    public InterviewLookupResponse (Interview interview, String resumeFileName, String createDate){

        this.interviewId = interview.getId();
        this.title = interview.getTitle();
        this.interviewType = interview.getInterviewType();
        this.resumeFileName = resumeFileName;
        this.createDate = createDate;
    }

}
