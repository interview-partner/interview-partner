package com.vip.interviewpartner.domain.tag.repository;

import com.vip.interviewpartner.domain.tag.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    /**
     * 주어진 문자열로 시작하는 상위 태그 목록을 사용 빈도수로 정렬하여 제한된 수로 검색합니다.
     *
     * @param name     태그 이름 시작 문자열
     * @param pageable 페이지 요청 정보
     * @return 검색된 태그 목록
     */
    Page<Tag> findByNameStartingWithOrderByUsageCountDesc(String name, Pageable pageable);
}
