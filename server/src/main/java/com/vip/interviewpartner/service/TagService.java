package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.DUPLICATE_TAG_NAME;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.Tag;
import com.vip.interviewpartner.dto.TagCreateRequest;
import com.vip.interviewpartner.dto.TagResponse;
import com.vip.interviewpartner.repository.TagRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 태그와 관련된 비즈니스 로직을 처리하는 서비스 클래스입니다.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    /**
     * 새로운 태그를 생성합니다.
     *
     * @param tagCreateRequest 태그 생성 요청 객체
     * @return 생성된 태그 정보
     * @throws CustomException 태그 이름이 중복될 경우 예외 발생
     */
    @Transactional
    public TagResponse create(TagCreateRequest tagCreateRequest) {
        if (tagRepository.existsByName(tagCreateRequest.getName())) {
            throw new CustomException(DUPLICATE_TAG_NAME);
        }
        Tag tag = tagRepository.save(new Tag(tagCreateRequest.getName()));
        return new TagResponse(tag);
    }

    /**
     * 검색 쿼리를 기반으로 태그 목록을 검색하고, 사용 빈도(usageCount) 기준으로 내림차순 정렬하여 반환합니다.
     *
     * @param query 검색할 태그 이름의 접두사
     * @param size 반환할 태그 목록의 최대 크기
     * @return 검색된 태그 목록을 TagResponse 객체로 변환하여 반환
     */
    public List<TagResponse> searchTags(String query, int size) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "usageCount"));
        return tagRepository.findByNameStartingWithOrderByUsageCountDesc(query, pageable).getContent()
                .stream()
                .map(TagResponse::new)
                .collect(Collectors.toList());
    }
}
