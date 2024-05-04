package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Member;
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
}
