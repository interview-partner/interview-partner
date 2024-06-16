package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.FeedbackResponse;
import com.vip.interviewpartner.dto.ParticipantDetailsResponse;
import com.vip.interviewpartner.service.FeedbackService;
import com.vip.interviewpartner.service.RoomParticipantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/participants")
@Tag(name = "participants", description = "참가자 API")
public class ParticipantController {

    private final RoomParticipantService roomParticipantService;
    private final FeedbackService feedbackService;

    /**
     * 주어진 참가자 ID로 참가 이력의 상세 정보를 조회합니다.
     *
     * @param customUserDetails 현재 인증된 사용자의 세부 정보
     * @param participantId     조회할 참가자 ID
     * @return ApiCommonResponse<ParticipantDetailsResponse> 참가 이력의 상세 정보를 담은 응답 객체
     */
    @Operation(summary = "참가 이력 상세 조회 API",
            description = "주어진 참가자 ID로 참가 이력의 상세 정보를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "참가 이력 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "유효하지 않은 참가자 ID", content = @Content),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
                    @ApiResponse(responseCode = "403", description = "권한 없음", content = @Content),
            }
    )
    @GetMapping("/{participantId}")
    public ApiCommonResponse<ParticipantDetailsResponse> getParticipantDetails(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                                               @PathVariable Long participantId) {
        ParticipantDetailsResponse roomParticipantDetails = roomParticipantService.findRoomParticipantDetails(customUserDetails.getMemberId(), participantId);
        return ApiCommonResponse.successResponse(roomParticipantDetails);
    }

    /**
     * 주어진 참가자 ID로 참가자의 피드백 정보를 조회합니다.
     *
     * @param customUserDetails 현재 인증된 사용자의 세부 정보
     * @param participantId     조회할 참가자 ID
     * @return ApiCommonResponse<List < FeedbackResponse>> 참가자의 피드백 정보를 담은 응답 객체
     */
    @Operation(summary = "참가자의 피드백 정보 조회 API",
            description = "주어진 참가자 ID로 참가자의 피드백 정보를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "참가자의 피드백 정보 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "유효하지 않은 참가자 ID", content = @Content),
                    @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
                    @ApiResponse(responseCode = "403", description = "권한 없음", content = @Content),
            }
    )
    @GetMapping("/{participantId}/feedbacks")
    public ApiCommonResponse<List<FeedbackResponse>> getParticipantFeedbacks(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                                             @PathVariable Long participantId) {
        List<FeedbackResponse> feedbacks = feedbackService.findFeedbacksByReceiverId(customUserDetails.getMemberId(), participantId);
        return ApiCommonResponse.successResponse(feedbacks);
    }
}
