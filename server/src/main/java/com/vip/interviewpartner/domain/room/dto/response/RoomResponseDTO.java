package com.vip.interviewpartner.domain.room.dto.response;

import com.vip.interviewpartner.common.util.DateTimeUtil;
import com.vip.interviewpartner.domain.room.enitty.Room;
import com.vip.interviewpartner.domain.room.enitty.RoomStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * 방 생성 응답 DTO 입니다.
 */
@Getter
@AllArgsConstructor
@Builder
@Schema(description = "방 생성 응답 DTO")
public class RoomResponseDTO {
    @Schema(description = "방 ID", example = "1")
    private Long id;

    @Schema(description = "방 제목", example = "Java 면접 연습")
    private String title;

    @Schema(description = "방의 세부 설명", example = "이 방은 Java 면접 질문 연습을 위한 방입니다.")
    private String details;

    @Schema(description = "방의 최대 참가자 수", example = "4")
    private Integer maxParticipants;

    @Schema(description = "방의 현재 참가자 수", example = "3")
    private int currentParticipants;

    @Schema(description = "방에 연결된 태그 목록", example = "[\"Java\", \"면접\", \"연습\"]")
    private List<String> tags;

    @Schema(description = "방의 현재 상태", example = "OPEN")
    private RoomStatus roomStatus;

    @Schema(description = "방 생성 시간", example = "2024.05.24 14:30")
    private String createdTime;

    /**
     * Room Entity -> RoomResponseDTO DTO 변환
     *
     * @param room                변환할 Room 엔티티
     * @param currentParticipants 현재 참가자 수
     * @return
     */
    public static RoomResponseDTO of(Room room, int currentParticipants) {
        return RoomResponseDTO.builder()
                .id(room.getId())
                .title(room.getTitle())
                .details(room.getDetails())
                .maxParticipants(room.getMaxParticipants())
                .currentParticipants(currentParticipants)
                .tags(room.getRoomTags().stream()
                        .map(roomTag -> roomTag.getTag().getName())
                        .toList())
                .roomStatus(room.getStatus())
                .createdTime(room.getCreateDate().format(DateTimeUtil.FORMATTER))
                .build();
    }
}
