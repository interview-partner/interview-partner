package com.vip.interviewpartner.domain;

import jakarta.persistence.CascadeType;
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
import lombok.Builder;
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

    @OneToMany(mappedBy = "room", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<RoomTag> roomTags = new ArrayList<>();

    @Builder
    public Room(Member owner, String title, String details, Integer maxParticipants, String sessionId) {
        this.owner = owner;
        this.title = title;
        this.details = details;
        this.maxParticipants = maxParticipants;
        this.sessionId = sessionId;
        this.status = RoomStatus.OPEN;
    }

    /**
     * RoomTag 객체를 현재 Room의 태그 목록에 추가합니다.
     *
     * @param tag
     */
    public void addTag(Tag tag) {
        if (roomTags.stream().noneMatch(roomTag -> roomTag.getTag().equals(tag))) {
            RoomTag roomTag = new RoomTag(this, tag);
            roomTags.add(roomTag);
        }
    }

    /**
     * RoomTag 객체를 현재 Room의 태그 목록에 삭제합니다.
     *
     * @param tag
     */
    public void removeTag(Tag tag) {
        RoomTag roomTagToRemove = roomTags.stream()
                .filter(roomTag -> roomTag.getTag().equals(tag))
                .findFirst()
                .orElse(null);
        if (roomTagToRemove != null) {
            roomTags.remove(roomTagToRemove);
            roomTagToRemove.setRoom(null);
        }
    }
}
