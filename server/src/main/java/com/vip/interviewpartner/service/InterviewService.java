package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.repository.InterviewRepository;
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

}


