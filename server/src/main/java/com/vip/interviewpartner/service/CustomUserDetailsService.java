package com.vip.interviewpartner.service;

import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * 사용자 세부 정보를 로드하는 서비스 클래스입니다.
 * 이 클래스는 Spring Security의 UserDetailsService 인터페이스를 구현합니다.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    /**
     * 주어진 이메일에 해당하는 사용자의 세부 정보를 로드합니다.
     * 이 메소드는 이메일을 인자로 받아, 해당 이메일을 가진 UserDetails를 반환합니다.
     *
     * @param email 사용자의 이메일
     * @return 사용자의 세부 정보를 담고 있는 UserDetails
     * @throws UsernameNotFoundException 해당 이메일을 가진 사용자가 존재하지 않는 경우
     * @throws BadCredentialsException 소셜로그인 계정으로 자체로그인하려는 경우
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException, BadCredentialsException {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        if (member.getProvider() != null || member.getProviderId() != null) {
            throw new BadCredentialsException("Cannot login with social account using email and password");
        }
        return new CustomUserDetails(member);
    }
}
