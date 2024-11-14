package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.tag.entity.Tag;
import com.vip.interviewpartner.domain.tag.service.TagService;
import com.vip.interviewpartner.domain.tag.dto.request.TagCreateRequest;
import com.vip.interviewpartner.domain.tag.dto.response.TagResponse;
import com.vip.interviewpartner.domain.tag.repository.TagRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagService tagService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("성공적으로 태그를 생성한다")
    void createTag_success() {
        //given
        TagCreateRequest request = new TagCreateRequest("newTag");

        //when
        when(tagRepository.existsByName(anyString())).thenReturn(false);
        when(tagRepository.save(any(Tag.class))).thenAnswer(i -> i.getArguments()[0]);

        TagResponse response = tagService.create(request);

        //then
        assertThat(response.getName()).isEqualTo(request.getName());
    }

    @Test
    @DisplayName("중복된 태그 이름으로 태그 생성 시 예외를 던진다")
    void createTag_duplicateName_throwsException() {
        //given
        TagCreateRequest request = new TagCreateRequest("duplicateTag");

        //when
        when(tagRepository.existsByName(anyString())).thenReturn(true);

        //then
        assertThatThrownBy(() -> tagService.create(request))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DUPLICATE_TAG_NAME);
    }
}
