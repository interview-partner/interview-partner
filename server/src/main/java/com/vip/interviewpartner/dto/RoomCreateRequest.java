package com.vip.interviewpartner.dto;

import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Room;
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
public class RoomCreateRequest {
    private String title;
    private String details;
    private Integer maxParticipants;
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
