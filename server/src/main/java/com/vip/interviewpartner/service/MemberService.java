package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * MemberService 클래스는 Member 객체와 관련된 비즈니스 로직을 처리합니다.
 * 이 클래스는 MemberRepository를 사용하여 데이터베이스와 상호 작용합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;

    /**
     * 주어진 ID로 Member 객체를 조회합니다.
     * 만약 해당 ID의 Member 객체를 찾지 못하면 CustomException을 발생시킵니다.
     *
     * @param memberId 조회할 Member 객체의 ID
     * @return 조회된 Member 객체
     * @throws CustomException 해당 ID의 Member 객체를 찾지 못한 경우 발생
     */
    public Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
    }
}
