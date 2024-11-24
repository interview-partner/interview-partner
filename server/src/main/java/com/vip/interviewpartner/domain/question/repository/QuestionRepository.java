package com.vip.interviewpartner.domain.question.repository;

import com.vip.interviewpartner.domain.interview.entity.Interview;
import com.vip.interviewpartner.domain.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Question 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByInterviewId(Long interviewId);

    @Query("SELECT q.interview FROM Question q WHERE q.id = :questionId")
    Optional<Interview> findInterviewByQuestionId(@Param("questionId") Long questionId);
}
