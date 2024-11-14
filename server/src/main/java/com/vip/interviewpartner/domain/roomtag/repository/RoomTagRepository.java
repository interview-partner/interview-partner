package com.vip.interviewpartner.domain.roomtag.repository;

import com.vip.interviewpartner.domain.roomtag.entity.RoomTag;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * RoomTag 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface RoomTagRepository extends JpaRepository<RoomTag, Integer> {
}
