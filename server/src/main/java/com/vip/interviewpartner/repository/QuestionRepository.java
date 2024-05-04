package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Question 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
