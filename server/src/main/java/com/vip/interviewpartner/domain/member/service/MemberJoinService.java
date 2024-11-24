package com.vip.interviewpartner.domain.member.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.DUPLICATE_EMAIL;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.member.dto.request.MemberJoinRequest;
import com.vip.interviewpartner.domain.member.repository.MemberRepository;
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

    private final MemberService memberService;
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
        memberService.checkNicknameDuplication(memberJoinRequest.getNickname());
        String encodePassword = bCryptPasswordEncoder.encode(memberJoinRequest.getPassword());
        Member member = memberJoinRequest.toEntity(encodePassword);
        memberRepository.save(member);
    }

    /**
     * 주어진 닉네임의 사용 가능 여부를 확인하는 메서드입니다. 닉네임이 사용 중인지 아닌지를 판단합니다.
     *
     * @param nickname 검사하고자 하는 사용자의 닉네임
     * @return 닉네임이 사용 가능할 경우 true, 그렇지 않을 경우 false를 반환합니다.
     */
    public boolean isNicknameAvailable(String nickname) {
        return !memberRepository.existsByNickname(nickname);
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
}
