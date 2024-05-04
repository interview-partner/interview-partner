package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.DUPLICATE_EMAIL;
import static com.vip.interviewpartner.common.exception.ErrorCode.DUPLICATE_NICKNAME;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.dto.MemberJoinRequest;
import com.vip.interviewpartner.repository.MemberRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@SpringBootTest
class MemberJoinServiceTest {

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    MemberJoinService memberJoinService;

    @Test
    @DisplayName("회원가입에 성공한다.")
    public void successJoin() throws Exception {
        //given
        //when
        MemberJoinRequest member1 = new MemberJoinRequest("asd@naver.com", "12345678", "홍길동");
        //then
        Assertions.assertDoesNotThrow(() -> memberJoinService.join(member1));
    }

    @Test
    @DisplayName("회원가입 시 이메일이 중복되면 예외를 던진다")
    public void checkEmailDuplication() throws Exception {
        //given
        MemberJoinRequest member1 = new MemberJoinRequest("asd@naver.com", "12345678", "홍길동");
        memberJoinService.join(member1);

        //when
        MemberJoinRequest member2 = new MemberJoinRequest("asd@naver.com", "12345678", "김철수");

        //then
        assertThatThrownBy(() -> memberJoinService.join(member2))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode")
                .isEqualTo(DUPLICATE_EMAIL);
    }

    @Test
    @DisplayName("회원가입 시 닉네임이 중복되면 예외를 던진다")
    public void checkNicknameDuplication() throws Exception {
        //given
        MemberJoinRequest member1 = new MemberJoinRequest("asd@naver.com", "12345678", "홍길동");
        memberJoinService.join(member1);

        //when
        MemberJoinRequest member2 = new MemberJoinRequest("asdasd@naver.com", "12345678", "홍길동");

        //then
        assertThatThrownBy(() -> memberJoinService.join(member2))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode")
                .isEqualTo(DUPLICATE_NICKNAME);
    }

}
