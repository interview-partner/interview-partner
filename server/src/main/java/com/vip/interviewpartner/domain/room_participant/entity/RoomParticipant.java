package com.vip.interviewpartner.domain.room_participant.entity;

import com.vip.interviewpartner.domain.resume.entity.Resume;
import com.vip.interviewpartner.domain.base.BaseTimeEntity;
import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.room.enitty.Room;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * 방 참여자 정보를 관리하는 엔티티입니다. 각 참여자는 특정 방, 멤버, 이력서와 연결되어 있으며, 참여 및 퇴장 날짜를 기록합니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Getter
public class RoomParticipant extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @Column(name = "join_date")
    private LocalDateTime joinDate;

    @Column(name = "leave_date")
    private LocalDateTime leaveDate;

    @Builder
    public RoomParticipant(Room room, Member member, Resume resume) {
        this.room = room;
        this.member = member;
        this.resume = resume;
    }

    /**
     * 사용자가 방에 입장한 시각을 설정합니다.
     *
     * @param joinDate 입장 시각
     */
    public void join(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

    /**
     * 사용자가 방에 퇴장한 시각을 설정합니다.
     *
     * @param leaveDate 퇴장 시각
     */
    public void leave(LocalDateTime leaveDate) {
        this.leaveDate = leaveDate;
    }

    public boolean isEqualsRoom(Room otherRoom) {
        return this.room.equals(otherRoom);
    }

    public boolean isEqualsMember(Member otherMember) {
        return this.member.equals(otherMember);
    }
}
