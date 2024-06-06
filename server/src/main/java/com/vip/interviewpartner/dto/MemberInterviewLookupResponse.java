package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.Interview;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "마이 페이지에 필요한 인터뷰 조회 응답 DTO")
public class MemberInterviewLookupResponse {
    @Schema(description = "인터뷰 ID", example = "1")
    private Long interviewId;

    @Schema(description = "인터뷰 제목", example = "네이버 면접 인터뷰")
    private String title;

    @Schema(description = "인터뷰 타입", example = "텍스트")
    private String interviewType;

    @Schema(description = "인터뷰 생성 날짜", example = "2024-05-22 14:19")
    private String createDate;

    /**
     * Interview Entity -> MemberInterviewLookupResponse DTO 변환하는 메서드입니다.
     *
     * @param interview Interview 객체
     * @return 생성된 MemberInterviewLookupResponse 객체
     */
    public static MemberInterviewLookupResponse of(Interview interview) {
        return MemberInterviewLookupResponse.builder()
                .interviewId(interview.getId())
                .title(interview.getTitle())
                .interviewType(interview.getInterviewType())
                .createDate(interview.getCreateDate().format(DateTimeUtil.FORMATTER))
                .build();
    }

}
