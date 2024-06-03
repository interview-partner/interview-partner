package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.InterviewLookupResponse;
import com.vip.interviewpartner.repository.InterviewRepository;
import com.vip.interviewpartner.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * InterviewService 클래스는 Interview 객체와 관련된 비즈니스 로직을 처리합니다.
 * 이 클래스는 InterviewRepository를 사용하여 데이터베이스와 상호 작용합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ResumeRepository resumeRepository;

    /**
     * 주어진 ID로 Interview 객체를 조회합니다.
     * 만약 해당 ID의 Interview 객체를 찾지 못하면 CustomException을 발생시킵니다.
     *
     * @param interviewId 조회할 Interview 객체의 ID
     * @return 조회된 Interview 객체
     * @throws CustomException 해당 ID의 Interview 객체를 찾지 못한 경우 발생
     * @throws CustomException 해당 ID의 Interview의 createDate를 찾지 못한 경우 발생
     * @throws CustomException 해당 ID의 Interview의 Resume의 originalFileName을 찾지 못한 경우 발생
     */
    public InterviewLookupResponse getInterviewById(Long memberId, Long interviewId) {

        validateInterviewOwnership(memberId, interviewId);
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST));

        return new InterviewLookupResponse(interview, interview.getResume().getOriginalFileName());
    }

    /**
     * 요청을 보낸 사용자가 인터뷰의 소유자와 일치하는지 검증합니다.
     *
     * @param memberId 요청을 보낸 사용자의 Id
     * @param interviewId 인터뷰Id
     */
    public void validateInterviewOwnership(Long memberId, Long interviewId){
        Member interviewMember = interviewRepository.findMemberById(interviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        if(!interviewMember.getId().equals(memberId)) {
            throw new CustomException(ErrorCode.MEMBER_ID_MISMATCH);
        }
    }

    /**
     * 요청을 보낸 사용자가 인터뷰의 소유자와 일치하는지 검증합니다. (디비 접근을 최소화 하기 위해 오버로딩 했습니다.)
     *
     * @param memberId 요청을 보낸 사용자의 Id
     * @param interview 인터뷰 객체
     */
    public void validateInterviewOwnership(Long memberId, Interview interview){
        Long interviewMemberId = interview.getMember().getId();
        if(!interviewMemberId.equals(memberId)) {
            throw new CustomException(ErrorCode.MEMBER_ID_MISMATCH);
        }
    }

}


