package com.vip.interviewpartner.domain.roomtag.entity;

import com.vip.interviewpartner.domain.tag.entity.Tag;
import com.vip.interviewpartner.domain.room.enitty.Room;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 방에 적용된 태그를 관리하는 엔티티입니다.
 * 각 태그는 특정 방과 태그 정보에 연결됩니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "room_tag", uniqueConstraints = {
        @UniqueConstraint(name = "UK_ROOM_TAG", columnNames = {"room_id", "tag_id"})
})
@Getter
public class RoomTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @Setter
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    public RoomTag(Room room, Tag tag) {
        this.room = room;
        this.tag = tag;
    }
}
