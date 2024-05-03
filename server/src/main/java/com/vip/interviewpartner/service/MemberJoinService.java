package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.*;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.MemberJoinRequest;
import com.vip.interviewpartner.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * 회원 가입 서비스를 제공하는 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberJoinService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * 사용자의 회원 가입 요청을 처리합니다.
     * 입력된 회원 정보를 검증하고, 중복된 이메일 또는 닉네임이 없는 경우 회원을 등록합니다.
     *
     * @param memberJoinRequest 사용자의 회원 가입 요청 정보를 담은 객체
     * @throws CustomException 이메일 또는 닉네임이 이미 존재하는 경우 발생하는 예외
     */
    @Transactional
    public void join(MemberJoinRequest memberJoinRequest) {
        checkEmailDuplication(memberJoinRequest.getEmail());
        checkNicknameDuplication(memberJoinRequest.getNickname());
        String encodePassword = bCryptPasswordEncoder.encode(memberJoinRequest.getPassword());
        Member member = memberJoinRequest.toEntity(encodePassword);
        memberRepository.save(member);
    }

    /**
     * 입력된 이메일이 이미 존재하는지 확인합니다.
     * 이미 존재하는 경우 CustomException을 발생시킵니다.
     *
     * @param email 확인할 이메일
     * @throws CustomException 이미 존재하는 이메일인 경우 발생하는 예외
     */
    private void checkEmailDuplication(String email) {
        if (memberRepository.existsByEmail(email)) {
            throw new CustomException(DUPLICATE_EMAIL);
        }
    }

    /**
     * 입력된 닉네임이 이미 존재하는지 확인합니다.
     * 이미 존재하는 경우 CustomException을 발생시킵니다.
     *
     * @param nickname 확인할 닉네임
     * @throws CustomException 이미 존재하는 닉네임인 경우 발생하는 예외
     */
    private void checkNicknameDuplication(String nickname) {
        if (memberRepository.existsByNickname(nickname)) {
            throw new CustomException(DUPLICATE_NICKNAME);
        }
    }
}
