package com.vip.interviewpartner.domain.member.repository;

import com.vip.interviewpartner.domain.member.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Member 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface MemberRepository extends JpaRepository<Member, Long> {

    /**
     * 주어진 이메일과 일치하는 회원이 존재하는지 여부를 확인합니다.
     *
     * @param email 확인할 이메일
     * @return 회원이 존재하는 경우 true, 그렇지 않은 경우 false
     */
    boolean existsByEmail(String email);

    /**
     * 주어진 닉네임과 일치하는 회원이 존재하는지 여부를 확인합니다.
     *
     * @param nickname 확인할 닉네임
     * @return 회원이 존재하는 경우 true, 그렇지 않은 경우 false
     */
    boolean existsByNickname(String nickname);

    /**
     * 주어진 이메일과 일치하는 회원을 찾습니다.
     * 이 메소드는 이메일을 인자로 받아, 해당 이메일을 가진 회원을 찾아 Optional로 반환합니다.
     *
     * @param email 찾을 회원의 이메일
     * @return 찾은 회원을 담고 있는 Optional, 회원이 존재하지 않는 경우 빈 Optional
     */
    Optional<Member> findByEmail(String email);

    /**
     * 주어진 제공자(provider), 제공자 ID(providerId)와 일치하는 회원을 찾습니다.
     * 이 메소드는 제공자와 제공자 ID를 인자로 받아, 해당 정보를 가진 회원을 찾아 Optional로 반환합니다.
     *
     * @param provider 소셜 로그인 제공자 (예: kakao, naver 등)
     * @param providerId 제공자 ID (소셜 로그인 제공자가 제공한 사용자 ID)
     * @return 찾은 회원을 담고 있는 Optional, 회원이 존재하지 않는 경우 빈 Optional
     */
    Optional<Member> findByProviderAndProviderId(String provider, String providerId);
}
