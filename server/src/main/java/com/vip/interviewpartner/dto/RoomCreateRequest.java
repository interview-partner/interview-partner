package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Room;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 방 생성을 위한 DTO 클래스입니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "방 생성 요청 DTO")
public class RoomCreateRequest {

    @Schema(description = "제목", example = "모의 면접방")
    @NotBlank
    private String title;

    @Schema(description = "설명", example = "모의 면접 방입니다.")
    private String details;

    @Schema(description = "최대 참가자수", example = "4")
    @Min(value = 2, message = "최소 참가자 수는 2명 이상이어야 합니다.")
    @Max(value = 4, message = "최대 참가자 수는 4명 이하여야 합니다.")
    private Integer maxParticipants;

    @Schema(description = "태그 Id list", example = "[1, 2, 3]")
    @Size(max = 3, message = "태그는 최대 3개 이하여야 합니다.")
    private List<Integer> tagIds;

    /**
     * 이 DTO를 Room 엔티티로 변환합니다.
     *
     * @param owner     방의 소유자
     * @param sessionId 방과 openvidu 세션 ID
     * @return 새로운 Room 엔티티
     */
    public Room toEntity(Member owner, String sessionId) {
        return Room.builder()
                .owner(owner)
                .title(title)
                .details(details)
                .maxParticipants(maxParticipants)
                .sessionId(sessionId)
                .build();
    }
}
