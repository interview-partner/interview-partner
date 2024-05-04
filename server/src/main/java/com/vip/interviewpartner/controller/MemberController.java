package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.MemberJoinRequest;
import com.vip.interviewpartner.service.MemberJoinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 회원 컨트롤러입니다. 이 컨트롤러는 회원 관련 API를 처리합니다.
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
@Tag(name = "members", description = "회원 API")
@Slf4j
public class MemberController {

    private final MemberJoinService memberJoinService;

    /**
     * 회원가입 API입니다.
     *
     * @param memberJoinRequest 사용자의 회원 가입 요청 정보를 담은 객체
     * @return ApiCommonResponse.successWithNoContent()
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "회원가입 API",
            description = "사용자 회원가입",
            responses = {
                    @ApiResponse(responseCode = "201", description = "회원가입 성공"),
                    @ApiResponse(responseCode = "409", description = "이메일 및 닉네임 중복 에러"),
            }
    )
    public ApiCommonResponse<?> addMember(@Valid @RequestBody final MemberJoinRequest memberJoinRequest) {
        memberJoinService.join(memberJoinRequest);
        return ApiCommonResponse.successWithNoContent();
    }
}
