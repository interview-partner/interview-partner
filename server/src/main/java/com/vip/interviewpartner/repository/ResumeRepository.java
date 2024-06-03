package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Resume;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Resume 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    /**
     * 특정 회원 ID와 활성 상태에 해당하는 이력서를 조회합니다.
     *
     * @param memberId 조회할 회원의 ID
     * @param isActive 이력서의 활성 상태
     * @return 특정 회원 ID와 활성 상태에 해당하는 이력서 리스트
     */
    @Query("SELECT r FROM Resume r WHERE r.member.id = :memberId AND r.isActive = :isActive")
    List<Resume> findByMemberIdAndIsActive(Long memberId, boolean isActive);

    /**
     * Resume ID로 originalFileName을 조회합니다.
     *
     * @param resumeId 조회할 Resume의 ID
     * @return originalFileName
     */
    @Query("SELECT r.originalFileName FROM Resume r WHERE r.id = :resumeId")
    Optional<String> findOriginalFileNameById(@Param("resumeId") Long resumeId);
}
