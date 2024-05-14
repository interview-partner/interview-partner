package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.MemberJoinRequest;
import com.vip.interviewpartner.dto.NicknameCheckResponse;
import com.vip.interviewpartner.service.MemberJoinService;
import com.vip.interviewpartner.service.ResumeUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 회원 컨트롤러입니다. 이 컨트롤러는 회원 관련 API를 처리합니다.
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
@Tag(name = "members", description = "회원 API")
@Slf4j
@Validated
public class MemberController {

    private final MemberJoinService memberJoinService;
    private final ResumeUploadService resumeUploadService;

    /**
     * 회원가입 API입니다.
     *
     * @param memberJoinRequest 사용자의 회원 가입 요청 정보를 담은 객체
     * @return ApiCommonResponse.successWithNoContent()
     */
    @Operation(summary = "회원가입 API",
            description = "사용자 회원가입",
            responses = {
                    @ApiResponse(responseCode = "201", description = "회원가입 성공"),
                    @ApiResponse(responseCode = "400", description = "유효한 형식이 아님", content = @Content),
                    @ApiResponse(responseCode = "409", description = "이메일 및 닉네임 중복 에러", content = @Content),
            }
    )
    @SecurityRequirements(value = {})
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<?> addMember(@Valid @RequestBody final MemberJoinRequest memberJoinRequest) {
        memberJoinService.join(memberJoinRequest);
        return ApiCommonResponse.successWithNoContent();
    }

    /**
     * 닉네임 중복확인 API입니다. 닉네임이 사용 가능한 경우 true를, 그렇지 않을 경우 false를 담아서 반환합니다.
     *
     * @param nickname 확인할 닉네임
     * @return ApiCommonResponse.successResponse();
     */
    @Operation(summary = "닉네임 중복 확인 API",
            description = "회원가입시 닉네임 중복 확인",
            responses = {
                    @ApiResponse(responseCode = "200", description = "응답 성공"),
                    @ApiResponse(responseCode = "400", description = "유효한 형식이 아님", content = @Content),
            }
    )
    @SecurityRequirements(value = {})
    @GetMapping("/check/nickname/{nickname}")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<NicknameCheckResponse> checkNickname(@NotBlank @Size(min = 2, max = 10) @PathVariable String nickname) {
        boolean nicknameAvailable = memberJoinService.isNicknameAvailable(nickname);
        return ApiCommonResponse.successResponse(new NicknameCheckResponse(nicknameAvailable));
    }


    @PostMapping("/me/resumes")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<?> uploadResume(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestParam("file") MultipartFile file) {

        resumeUploadService.upload(customUserDetails.getMemberId(), file);
        return ApiCommonResponse.successWithNoContent();
    }

}
