package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Interview 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    /**
     * 인터뷰 ID가 주어지면 인터뷰의 멤버 객체를 반환하는 매서드입니다.
     *
     * @param id 인터뷰 ID
     * @return 인터뷰의 멤버 객체
     */
    @Query("SELECT i.member FROM Interview i WHERE i.id = :id")
    Optional<Member> findMemberById(Long id);

    /**
     * 멤버 ID가 주어지면 해당하는 인터뷰들을 반환하는 매서드입니다.
     *
     * @param memberId 멤버 ID
     * @param pageable 조회할 페이지의 정보
     * @return
     */
    @Query("SELECT i FROM Interview i WHERE i.member.id = :memberId")
    Page<Interview> findByMemberId(@Param("memberId") Long memberId, Pageable pageable);

}
