package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.RoomParticipant;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 방 참가 이력 조회 응답 DTO 클래스입니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "방 참가 이력 조회 응답 DTO")
public class ParticipationResponse {
    @Schema(description = "참가 ID", example = "1")
    private Long participantId;

    @Schema(description = "방 ID", example = "1")
    private Long roomId;

    @Schema(description = "방 제목", example = "네카라쿠배 면접 대비 방")
    private String roomTitle;

    @Schema(description = "방 참가 날짜 및 시간", example = "2024.05.24 14:30")
    private String joinDate;

    @Schema(description = "피드백 개수 (해당 방에서 받은 피드백 개수)", example = "3")
    private int feedbackCount;

    /**
     * RoomParticipant Entity -> ParticipationResponse DTO 변환하는 메서드입니다.
     *
     * @param participant RoomParticipant 객체
     * @param feedbackCount 피드백 개수
     * @return 생성된 ParticipationResponse 객체
     */
    public static ParticipationResponse of(RoomParticipant participant, int feedbackCount) {
        return ParticipationResponse.builder()
                .participantId(participant.getId())
                .roomId(participant.getRoom().getId())
                .roomTitle(participant.getRoom().getTitle())
                .joinDate(participant.getJoinDate().format(DateTimeUtil.FORMATTER))
                .feedbackCount(feedbackCount)
                .build();
    }
}
