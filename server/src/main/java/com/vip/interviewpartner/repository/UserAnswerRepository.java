package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * UserAnswer 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {

    /**
     * 질문 ID로 답변 내용을 찾는 메서드
     *
     * @param questionId 질문 ID
     * @return 답변 내용
     */
    @Query("SELECT ua.content FROM UserAnswer ua WHERE ua.question.id = :questionId")
    String findContentByQuestionId(Long questionId);
}
