package com.vip.interviewpartner.domain.feedback.entity;

import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
import com.vip.interviewpartner.domain.base.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 모의면접중 사용자간의 피드백을 저장하는 엔티티입니다.
 * 각 피드백은 특정 방의 참여자(RoomParticipant)와 연결되며, 보낸 사람과 받는 사람에 대한 정보를 포함합니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Feedback extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_participant_id")
    private RoomParticipant sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_participant_id")
    private RoomParticipant receiver;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder
    public Feedback(RoomParticipant sender, RoomParticipant receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
    }
}
