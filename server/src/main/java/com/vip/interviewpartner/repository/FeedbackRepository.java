package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Feedback;
import com.vip.interviewpartner.domain.RoomParticipant;
import com.vip.interviewpartner.dto.FeedbackCountDTO;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Feedback 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    /**
     * 주어진 보낸 사람과 받는 사람 간에 이미 존재하는 피드백이 있는지 확인합니다.
     *
     * @param sender 피드백을 보낸 사람인 RoomParticipant 객체
     * @param receiver 피드백을 받는 사람인 RoomParticipant 객체
     * @return 보낸 사람과 받는 사람 조합으로 이미 존재하는 피드백이 있으면 true, 없으면 false를 반환합니다.
     */
    boolean existsBySenderAndReceiver(RoomParticipant sender, RoomParticipant receiver);

    /**
     * 피드백을 받은 참가자 ID 목록에 대한 피드백 개수를 조회합니다.
     * 피드백을 받은 참가자 ID 별로 피드백 개수를 그룹화하여 FeedbackCountDTO 객체로 반환합니다.
     *
     * @param receiverIds 피드백을 받은 참가자 ID 목록
     * @return FeedbackCountDTO 객체 리스트
     */
    @Query("SELECT new com.vip.interviewpartner.dto.FeedbackCountDTO(f.receiver.id, COUNT(f))"
            + "FROM Feedback f WHERE f.receiver.id IN :receiverIds GROUP BY f.receiver.id")
    List<FeedbackCountDTO> countFeedbacksByReceiverIds(@Param("receiverIds") List<Long> receiverIds);
}
