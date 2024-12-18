package com.vip.interviewpartner.domain.member.controller;

import com.vip.interviewpartner.common.aop.Login;
import com.vip.interviewpartner.common.dto.ApiCommonResponse;
import com.vip.interviewpartner.common.dto.PageCustom;
import com.vip.interviewpartner.domain.interview.dto.response.MemberInterviewLookupResponse;
import com.vip.interviewpartner.domain.interview.service.InterviewService;
import com.vip.interviewpartner.domain.member.dto.CustomUserDetails;
import com.vip.interviewpartner.domain.member.dto.request.MemberJoinRequest;
import com.vip.interviewpartner.domain.member.dto.request.MemberUpdateRequest;
import com.vip.interviewpartner.domain.member.dto.response.MemberInfoResponse;
import com.vip.interviewpartner.domain.member.dto.response.NicknameCheckResponse;
import com.vip.interviewpartner.domain.member.service.MemberJoinService;
import com.vip.interviewpartner.domain.member.service.MemberService;
import com.vip.interviewpartner.domain.resume.dto.response.ResumeLookupResponse;
import com.vip.interviewpartner.domain.resume.service.ResumeService;
import com.vip.interviewpartner.domain.resume.service.ResumeUploadService;
import com.vip.interviewpartner.domain.room_participant.dto.response.ParticipationResponse;
import com.vip.interviewpartner.domain.room_participant.service.ParticipantLookupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    private final MemberService memberService;
    private final ResumeUploadService resumeUploadService;
    private final ResumeService resumeService;
    private final ParticipantLookupService participantLookupService;
    private final InterviewService interviewService;

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
     * 닉네임 중복확인 API입니다.
     * 닉네임이 사용 가능한 경우 true를, 그렇지 않을 경우 false를 담아서 반환합니다.
     *
     * @param nickname 확인할 닉네임
     * @return ApiCommonResponse<NicknameCheckResponse> 닉네임 중복 확인 응답 객체
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


    /**
     * 현재 로그인된 사용자의 회원 정보를 조회하는 API입니다.
     *
     * @param customUserDetails 사용자 인증 정보
     * @return ApiCommonResponse<MemberInfoResponse> 조회된 회원 정보 응답 객체
     */
    @Operation(summary = "회원정보 조회 API",
            description = "현재 로그인된 사용자의 회원 정보를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "회원정보 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "유효한 요청이 아님", content = @Content),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            }
    )
    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<MemberInfoResponse> getMemberInfo(@Login Long memberId) {
        MemberInfoResponse memberInfoResponse = memberService.getMemberInfo(memberId);
        return ApiCommonResponse.successResponse(memberInfoResponse);
    }

    /**
     * 현재 로그인된 사용자의 회원 정보를 수정하는 API입니다.
     *
     * @param customUserDetails 사용자 인증 정보
     * @return ApiCommonResponse.successWithNoContent
     */
    @Operation(summary = "회원정보 수정 API",
            description = "현재 로그인된 사용자의 회원 정보를 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "회원정보 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "유효한 요청이 아님", content = @Content),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
                    @ApiResponse(responseCode = "409", description = "닉네임 중복", content = @Content),
            }
    )
    @PatchMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<?> updateMemberInfo(@Login Long memberId,
                                                 @Valid @RequestBody MemberUpdateRequest request) {
        memberService.updateInfo(memberId, request);
        return ApiCommonResponse.successWithNoContent();
    }

    /**
     * 현재 로그인된 사용자의 이력서를 업로드하는 API입니다.
     *
     * @param customUserDetails 사용자 인증 정보
     * @param file 업로드할 이력서 파일
     * @return ApiCommonResponse.successWithNoContent()
     */
    @Operation(summary = "이력서 업로드 API",
            description = "현재 로그인된 사용자가 이력서를 업로드합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "이력서 업로드 성공"),
                    @ApiResponse(responseCode = "400", description = "이력서 업로드 실패 및 유효한 요청이 아님", content = @Content),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            }
    )
    @PostMapping("/me/resumes")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<?> uploadResume(@Login Long memberId, @RequestParam("file") MultipartFile file) {
        resumeUploadService.upload(memberId, file);
        return ApiCommonResponse.successWithNoContent();
    }

    /**
     * 현재 로그인된 사용자의 이력서를 조회 API입니다.
     *
     * @param customUserDetails 사용자 인증 정보
     * @return ApiCommonResponse<List<ResumeLookupResponse>> 조회된 이력서 목록 응답 객체
     */
    @Operation(summary = "이력서 조회 API",
            description = "현재 로그인된 사용자의 이력서를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "이력서 조회 성공"),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            }
    )
    @GetMapping("/me/resumes")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<List<ResumeLookupResponse>> getResumes(@Login Long memberId) {
        List<ResumeLookupResponse> resumes = resumeService.getResumesByMemberId(memberId);
        return ApiCommonResponse.successResponse(resumes);
    }

    /**
     * 현재 로그인된 사용자의 모의면접 방 참가 이력을 조회하는 API입니다.
     * @param customUserDetails 사용자 인증 정보
     * @return ApiCommonResponse<PageCustom<ParticipationResponse>> 조회된 모의면접 방 참가 이력 조회 응답 객체
     */
    @Operation(summary = "모의면접 방 참가 이력 조회 API",
            description = "현재 로그인된 사용자의 모의면접 방 참가 이력을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "모의 면접 방 참가 이력 조회 성공"),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            }
    )
    @GetMapping("/me/rooms")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<PageCustom<ParticipationResponse>> getParticipation(@Login Long memberId,
                                                                                 @Parameter(description = "페이지 기본값: page=0, size=10, sort=joinDate, direction=DESC") @PageableDefault(size = 10, sort = "joinDate", direction = Sort.Direction.DESC) Pageable pageable) {
        PageCustom<ParticipationResponse> participationResponses = participantLookupService.getParticipation(memberId, pageable);
        return ApiCommonResponse.successResponse(participationResponses);
    }

    /**
     * 현재 로그인된 사용자의 인터뷰를 조회하는 API입니다.
     * @param customUserDetails 사용자 인증 정보
     * @return ApiCommonResponse<Page<InterviewLookupResponse>> 조회된 인터뷰 조회 응답 리스트
     */
    @Operation(summary = "로그인 된 사용자 AI면접 이력 조회 API",
            description = "현재 로그인된 사용자의 AI면접 이력을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "인터뷰 조회 성공"),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            }
    )
    @GetMapping("/me/interviews")
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<PageCustom<MemberInterviewLookupResponse>> getInterview(@Login Long memberId,
                                                                                     @Parameter(description = "페이지 기본값: page=0, size=10, sort=createDate, direction=DESC") @PageableDefault(size = 10, sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable) {
        PageCustom<MemberInterviewLookupResponse> memberInterviewLookupResponses = interviewService.getInterviewByMemberId(memberId, pageable);
        return ApiCommonResponse.successResponse(memberInterviewLookupResponses);
    }

}
