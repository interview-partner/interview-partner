package com.vip.interviewpartner.domain.tag.dto.response;

import com.vip.interviewpartner.domain.tag.entity.Tag;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 태그 정보 응답 객체입니다.
 */
@Getter
@AllArgsConstructor
public class TagResponse {
    @Schema(description = "태그 ID", example = "1")
    private Integer id;
    @Schema(description = "태그 이름", example = "Java")
    private String name;

    public TagResponse(Tag tag) {
        this.id = tag.getId();
        this.name = tag.getName();
    }
}
