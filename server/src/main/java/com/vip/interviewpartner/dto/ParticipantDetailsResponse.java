package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.Resume;
import com.vip.interviewpartner.domain.Room;
import com.vip.interviewpartner.domain.RoomParticipant;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ParticipantDetailsResponse 클래스는 RoomParticipant, Room, Resume 엔티티의 상세 정보를 담는 DTO입니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "방 참가 이력 상세 조회 응답 DTO")
public class ParticipantDetailsResponse {
    @Schema(description = "방 제목", example = "네카라쿠배 면접 대비 방")
    private String title;

    @Schema(description = "방의 세부 설명", example = "이 방은 Java 면접 질문 연습을 위한 방입니다.")
    private String details;

    @Schema(description = "방의 최대 참가자 수", example = "4")
    private Integer maxParticipants;

    @Schema(description = "방에 연결된 태그 목록", example = "[\"Java\", \"면접\", \"연습\"]")
    private List<String> tags;

    @Schema(description = "참여한 이력서의 파일 이름", example = "resume.pdf")
    private String originalFileName;

    @Schema(description = "참여한 이력서의 파일 경로", example = "/files/resume.pdf")
    private String filePath;

    @Schema(description = "방 참가 날짜 및 시간", example = "2024.05.24 14:30")
    private String joinDate;

    @Schema(description = "방 퇴장 날짜 및 시간", example = "2024.05.24 15:30")
    private String leaveDate;

    /**
     * RoomParticipant, Room, Resume 엔티티로부터 ParticipantDetailsResponse 객체를 생성합니다.
     *
     * @param participant RoomParticipant 엔티티
     * @param room Room 엔티티
     * @param resume Resume 엔티티
     * @return 생성된 ParticipantDetailsResponse 객체
     */
    public static ParticipantDetailsResponse of(RoomParticipant participant, Room room, Resume resume) {
        return ParticipantDetailsResponse.builder()
                .title(room.getTitle())
                .details(room.getDetails())
                .maxParticipants(room.getMaxParticipants())
                .tags(room.getRoomTags().stream()
                        .map(roomTag -> roomTag.getTag().getName())
                        .toList())
                .originalFileName(resume.getOriginalFileName())
                .filePath(resume.getFilePath())
                .joinDate(Optional.ofNullable(participant.getJoinDate()).map(date -> date.format(DateTimeUtil.FORMATTER)).orElse(""))
                .leaveDate(Optional.ofNullable(participant.getLeaveDate()).map(date -> date.format(DateTimeUtil.FORMATTER)).orElse(""))
                .build();
    }

}
