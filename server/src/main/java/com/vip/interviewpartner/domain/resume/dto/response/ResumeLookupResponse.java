package com.vip.interviewpartner.domain.resume.dto.response;

import com.vip.interviewpartner.domain.resume.entity.Resume;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 이력서 조회 응답 DTO 클래스입니다.
 * 이 클래스는 이력서 조회 API의 응답 데이터를 담고 있습니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "이력서 조회 응답 DTO")
public class ResumeLookupResponse {
    @Schema(description = "이력서 ID", example = "1")
    private Long id;

    @Schema(description = "원본 파일 이름", example = "resume.pdf")
    private String originalFileName;

    @Schema(description = "파일 경로", example = "/files/resume.pdf")
    private String filePath;

    /**
     * Resume Entity -> ResumeLookupResponse DTO 변환하는 메서드입니다.
     *
     * @param resume 변환할 Resume 엔티티
     * @return 변환된 ResumeLookupResponse 객체
     */
    public static ResumeLookupResponse of(Resume resume) {
        return ResumeLookupResponse.builder()
                .id(resume.getId())
                .originalFileName(resume.getOriginalFileName())
                .filePath(resume.getFilePath())
                .build();
    }
}
