package com.vip.interviewpartner.service;

import com.vip.interviewpartner.domain.Feedback;
import com.vip.interviewpartner.domain.RoomParticipant;
import com.vip.interviewpartner.dto.FeedbackResponse;
import com.vip.interviewpartner.repository.FeedbackRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * FeedbackService는 피드백 관련 비즈니스 로직을 담당하는 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedbackService {
    private final RoomParticipantService roomParticipantService;
    private final FeedbackRepository feedbackRepository;

    /**
     * 주어진 회원 ID와 참가자 ID로 참가자에게 전달된 피드백을 조회합니다.
     *
     * @param memberId      조회를 요청한 회원의 ID
     * @param participantId 피드백을 받을 참가자의 ID
     * @return List<FeedbackResponse> 조회된 피드백 응답 목록
     */
    public List<FeedbackResponse> findFeedbacksByReceiverId(Long memberId, Long participantId) {
        RoomParticipant roomParticipant = roomParticipantService.findRoomParticipant(participantId);
        roomParticipantService.validateMemberOwnership(memberId, roomParticipant);
        List<Feedback> feedbacks = feedbackRepository.findByReceiverId(participantId);
        return feedbacks.stream()
                .map(FeedbackResponse::of)
                .toList();
    }
}
