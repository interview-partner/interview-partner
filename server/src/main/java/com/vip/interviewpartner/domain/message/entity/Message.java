package com.vip.interviewpartner.domain.message.entity;

import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 간의 메시지를 저장하는 엔티티입니다.
 * 각 메시지는 특정 방(Room)과 보낸 사람에 연결되어 있으며, 메시지 내용을 포함합니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_participant_id")
    private RoomParticipant roomParticipant;

    private String content;

    private LocalDateTime createDate;

    @Builder

    public Message(RoomParticipant roomParticipant, String content, LocalDateTime createDate) {
        this.roomParticipant = roomParticipant;
        this.content = content;
        this.createDate = createDate;
    }
}
