package com.vip.interviewpartner.domain.room_participant.service;

import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
import com.vip.interviewpartner.domain.feedback.dto.response.FeedbackCountDTO;
import com.vip.interviewpartner.dto.PageCustom;
import com.vip.interviewpartner.domain.room_participant.dto.response.ParticipationResponse;
import com.vip.interviewpartner.domain.feedback.repository.FeedbackRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ParticipantLookupService 클래스는 멤버의 모의면접 참가 이력을 조회하는 비즈니스 로직을 처리합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ParticipantLookupService {
    private final RoomParticipantService roomParticipantService;
    private final FeedbackRepository feedbackRepository;

    /**
     * 주어진 멤버 ID로 모의면접 방 참가 이력을 조회하여 페이징된 ParticipationResponse 객체로 반환합니다.
     *
     * @param memberId 조회할 멤버의 ID
     * @param pageable 페이징 정보
     * @return 페이징된 ParticipationResponse 객체
     */
    public PageCustom<ParticipationResponse> getParticipation(Long memberId, Pageable pageable) {
        Page<RoomParticipant> participants = roomParticipantService.findByMemberId(memberId, pageable);
        List<Long> participantIds = extractParticipantIds(participants);
        Map<Long, Long> feedbackCounts = getFeedbackCounts(participantIds);
        Page<ParticipationResponse> page = createParticipationResponsePage(participants, feedbackCounts);
        return new PageCustom<>(page);
    }

    /**
     * 주어진 Page<RoomParticipant> 객체에서 참가자 ID를 추출하여 List<Long> 형태로 반환합니다.
     *
     * @param participants 참가자 페이지 객체
     * @return 참가자 ID 목록
     */
    private List<Long> extractParticipantIds(Page<RoomParticipant> participants) {
        return participants.stream()
                .map(RoomParticipant::getId)
                .collect(Collectors.toList());
    }

    /**
     * 주어진 참가자 ID 목록에 대한 피드백 수를 조회하여 Map<Long, Long> 형태로 반환합니다.
     *
     * @param participantIds 참가자 ID 목록
     * @return 피드백 수 Map
     */
    private Map<Long, Long> getFeedbackCounts(List<Long> participantIds) {
        List<FeedbackCountDTO> feedbackCountList = feedbackRepository.countFeedbacksByReceiverIds(participantIds);
        return feedbackCountList.stream()
                .collect(Collectors.toMap(FeedbackCountDTO::getReceiverId, FeedbackCountDTO::getCount));
    }

    /**
     * 참가자 페이지 객체와 피드백 수 Map을 사용하여 ParticipationResponse 페이지 객체를 생성합니다.
     *
     * @param participants 참가자 페이지 객체
     * @param feedbackCounts 피드백 수 Map
     * @return ParticipationResponse 페이지 객체
     */
    private Page<ParticipationResponse> createParticipationResponsePage(Page<RoomParticipant> participants, Map<Long, Long> feedbackCounts) {
        return participants.map(participant -> {
            int feedbackCount = feedbackCounts.getOrDefault(participant.getId(), 0L).intValue();
            return ParticipationResponse.of(participant, feedbackCount);
        });
    }
}
