package com.vip.interviewpartner.repository;

import com.vip.interviewpartner.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Tag 엔티티에 대한 데이터 접근 리포지토리입니다.
 */
public interface TagRepository extends JpaRepository<Tag, Integer> {
    /**
     * 주어진 이름을 가진 태그가 존재하는지 확인합니다.
     *
     * @param name 태그 이름
     * @return 해당 이름을 가진 태그가 존재하면 true, 그렇지 않으면 false
     */
    boolean existsByName(String name);
}
