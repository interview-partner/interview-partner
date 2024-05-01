package com.vip.interviewpartner.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 모의면접방을 관리하는 엔티티입니다.
 * 각 방은 여러 태그를 가질 수 있습니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Room extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Member owner;

    private String title;
    private String details;
    private Integer maxParticipants;
    private String sessionId;

    @Column(columnDefinition = "varchar(255)", nullable = false)
    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @OneToMany(mappedBy = "room")
    private List<RoomTag> roomTags = new ArrayList<>();

    /**
     * RoomTag 객체를 현재 Room의 태그 목록에 추가합니다.
     *
     * @param roomTag
     */
    public void addRoomTag(RoomTag roomTag) {
        if(!roomTags.contains(roomTag)) {
            roomTags.add(roomTag);
            roomTag.setRoom(this);
        }
    }

    /**
     * RoomTag 객체를 현재 Room의 태그 목록에 삭제합니다.
     *
     * @param roomTag
     */
    public void removeRoomTag(RoomTag roomTag) {
        if (roomTags.contains(roomTag)) {
            roomTags.remove(roomTag);
            roomTag.setRoom(null);
        }
    }
}
