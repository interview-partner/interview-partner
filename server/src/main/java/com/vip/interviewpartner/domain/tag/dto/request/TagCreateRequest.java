package com.vip.interviewpartner.domain.tag.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 태그 생성 요청 DTO 입니다.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TagCreateRequest {

    @Schema(description = "태그 이름", example = "Java")
    @NotBlank(message = "태그 이름은 비어 있을 수 없습니다.")
    @Size(min = 1, max = 15, message = "태그 이름은 1자 이상 15자 이하이어야 합니다.")
    private String name;
}
