package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.RoomParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * RoomParticipant 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {
    /**
     * 주어진 멤버 ID를 기반으로 RoomParticipant 객체를 페이징하여 조회합니다.
     * Room 엔티티를 함께 페치 조인(fetch join)하여 조회합니다.
     *
     * @param memberId 조회할 멤버의 ID
     * @param pageable 페이징 정보
     * @return 페이징된 RoomParticipant 객체 목록
     */
    @EntityGraph(attributePaths = {"room"})
    Page<RoomParticipant> findByMemberId(Long memberId, Pageable pageable);
}
