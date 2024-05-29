package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Feedback;
import com.vip.interviewpartner.domain.RoomParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Feedback 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    /**
     * 주어진 보낸 사람과 받는 사람 간에 이미 존재하는 피드백이 있는지 확인합니다.
     *
     * @param sender 피드백의 보낸 사람인 RoomParticipant 객체
     * @param receiver 피드백의 받는 사람인 RoomParticipant 객체
     * @return 보낸 사람과 받는 사람 조합으로 이미 존재하는 피드백이 있으면 true, 없으면 false를 반환합니다.
     */
    boolean existsBySenderAndReceiver(RoomParticipant sender, RoomParticipant receiver);
}
