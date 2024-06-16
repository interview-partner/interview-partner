package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.DUPLICATE_EMAIL;
import static com.vip.interviewpartner.common.exception.ErrorCode.DUPLICATE_NICKNAME;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.dto.MemberJoinRequest;
import com.vip.interviewpartner.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class MemberJoinServiceTest {

    private MemberRepository memberRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private MemberJoinService memberJoinService;
    private MemberService memberService;

    @BeforeEach
    void setUp() {
        memberRepository = Mockito.mock(MemberRepository.class);
        bCryptPasswordEncoder = Mockito.mock(BCryptPasswordEncoder.class);
        memberService = new MemberService(memberRepository);
        memberJoinService = new MemberJoinService(memberService, memberRepository, bCryptPasswordEncoder);
    }

    @Test
    @DisplayName("회원가입에 성공한다.")
    void successJoin() {
        // given
        MemberJoinRequest member1 = new MemberJoinRequest("asd@naver.com", "12345678", "홍길동");

        // when
        when(memberRepository.existsByEmail(member1.getEmail())).thenReturn(false);
        when(memberRepository.existsByNickname(member1.getNickname())).thenReturn(false);

        // then
        assertDoesNotThrow(() -> memberJoinService.join(member1));
    }

    @Test
    @DisplayName("회원가입 시 이메일이 중복되면 예외를 던진다")
    void checkEmailDuplication() {
        // given
        MemberJoinRequest member1 = new MemberJoinRequest("asd@naver.com", "12345678", "홍길동");
        when(memberRepository.existsByEmail(member1.getEmail())).thenReturn(true);

        // then
        assertThatThrownBy(() -> memberJoinService.join(member1))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode")
                .isEqualTo(DUPLICATE_EMAIL);
    }

    @Test
    @DisplayName("회원가입 시 닉네임이 중복되면 예외를 던진다")
    void checkNicknameDuplication() {
        // given
        MemberJoinRequest member1 = new MemberJoinRequest("asd@naver.com", "12345678", "홍길동");

        when(memberRepository.existsByEmail(member1.getEmail())).thenReturn(false);
        when(memberRepository.existsByNickname(member1.getNickname())).thenReturn(true);

        // then
        assertThatThrownBy(() -> memberJoinService.join(member1))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode")
                .isEqualTo(DUPLICATE_NICKNAME);
    }
}
