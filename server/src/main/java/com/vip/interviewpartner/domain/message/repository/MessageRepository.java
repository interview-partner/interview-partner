package com.vip.interviewpartner.domain.message.repository;

import com.vip.interviewpartner.domain.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Message 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface MessageRepository extends JpaRepository<Message, Integer> {
}
