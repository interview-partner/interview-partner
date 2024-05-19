package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.TagCreateRequest;
import com.vip.interviewpartner.dto.TagResponse;
import com.vip.interviewpartner.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 태그 생성 및 관련 기능을 제공하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tags")
@Tag(name = "tags", description = "태그 API")
public class TagController {
    private final TagService tagService;

    @Operation(summary = "태그 생성 API",
            description = "새로운 태그를 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "태그 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "유효하지 않은 형식, 태그이름은 1자 이상 15자 이하입니다", content = @Content),
                    @ApiResponse(responseCode = "409", description = "태그 이름 중복 에러", content = @Content),
            }
    )
    @PostMapping
    public ApiCommonResponse<TagResponse> createTag(@RequestBody TagCreateRequest tagCreateRequest) {
        TagResponse tagResponse = tagService.create(tagCreateRequest);
        return ApiCommonResponse.successResponse(tagResponse);
    }
}
