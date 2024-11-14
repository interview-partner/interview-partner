package com.vip.interviewpartner.domain.feedback.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.*;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.feedback.entity.Feedback;
import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
import com.vip.interviewpartner.domain.feedback.dto.request.FeedbackCreateRequest;
import com.vip.interviewpartner.domain.feedback.repository.FeedbackRepository;
import com.vip.interviewpartner.domain.room_participant.service.RoomParticipantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * FeedbackCreateService는 피드백을 생성하는 서비스 클래스입니다.
 * 이 클래스는 피드백 생성 시 필요한 검증 로직을 포함하고 있습니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class FeedbackCreateService {
    private final RoomParticipantService roomParticipantService;
    private final FeedbackRepository feedbackRepository;

    /**
     * 주어진 요청에 따라 피드백을 생성합니다.
     *
     * @param memberId 요청을 보낸 사용자의 ID
     * @param request 피드백 생성 요청 데이터
     */
    @Transactional
    public void createFeedback(Long memberId, FeedbackCreateRequest request) {
        RoomParticipant sender = roomParticipantService.findRoomParticipant(request.getSenderParticipantId());
        RoomParticipant receiver = roomParticipantService.findRoomParticipant(request.getReceiverParticipantId());
        validateSender(memberId, sender.getMember());;
        validateFeedbackParticipants(sender, receiver);
        validateDuplicateFeedback(sender, receiver);
        feedbackRepository.save(Feedback.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .build());
    }

    /**
     * 요청을 보낸 사용자가 피드백의 보낸 사람과 일치하는지 검증합니다.
     *
     * @param memberId 요청을 보낸 사용자의 ID
     * @param sender 피드백의 보낸 사람
     * @throws CustomException 사용자가 일치하지 않으면 발생합니다.
     */
    private void validateSender(Long memberId, Member sender) {
        if(!memberId.equals(sender.getId())) {
            throw new CustomException(INVALID_REQUEST);
        }
    }

    /**
     * 피드백의 보낸 사람과 받는 사람이 동일한 방에 있는지, 그리고 동일한 사용자가 아닌지 검증합니다.
     *
     * @param sender 피드백의 보낸 사람
     * @param receiver 피드백의 받는 사람
     * @throws CustomException 두 사용자가 다른 방에 있거나 동일한 사용자이면 발생합니다.
     */
    private void validateFeedbackParticipants(RoomParticipant sender, RoomParticipant receiver) {
        if (!sender.getRoom().equals(receiver.getRoom())) {
            throw new CustomException(INVALID_REQUEST);
        }
        if (sender.getMember().equals(receiver.getMember())) {
            throw new CustomException(INVALID_REQUEST);
        }
    }

    /**
     * 보낸 사람과 받는 사람 간에 중복된 피드백이 이미 존재하는지 검증합니다.
     *
     * @param sender 피드백의 보낸 사람
     * @param receiver 피드백의 받는 사람
     * @throws CustomException 보낸 사람과 받는 사람 조합으로 이미 존재하는 피드백이 있을 경우 발생합니다.
     */
    private void validateDuplicateFeedback(RoomParticipant sender, RoomParticipant receiver) {
        if (feedbackRepository.existsBySenderAndReceiver(sender, receiver)) {
            throw new CustomException(DUPLICATE_FEEDBACK);
        }
    }
}
