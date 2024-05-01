package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interview 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface InterviewRepository extends JpaRepository<Interview, Long> {
}
