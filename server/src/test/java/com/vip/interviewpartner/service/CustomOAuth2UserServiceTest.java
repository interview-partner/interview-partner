package com.vip.interviewpartner.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.vip.interviewpartner.domain.member.repository.MemberRepository;
import com.vip.interviewpartner.domain.member.service.CustomOAuth2UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class CustomOAuth2UserServiceTest {

    private MemberRepository memberRepository;
    private CustomOAuth2UserService customOAuth2UserService;

    @BeforeEach
    void setUp() {
        memberRepository = Mockito.mock(MemberRepository.class);
        customOAuth2UserService = new CustomOAuth2UserService(memberRepository);
    }

    @Test
    @DisplayName("고유한 닉네임(12자리를) 정상적으로 생성한다.")
    void createUniqueNickname() {
        // given
        when(memberRepository.existsByNickname(Mockito.anyString())).thenReturn(false);

        // when
        String uniqueNickname = customOAuth2UserService.createUniqueNickname();

        // then
        assertThat(uniqueNickname).isNotNull();
        assertThat(uniqueNickname.length()).isEqualTo(12);
    }
}
