package com.vip.interviewpartner.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.List;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Schema(description = "페이지 내용 및 페이지네이션 정보를 포함하는 DTO")
@Getter
public class PageCustom<T> implements Serializable {
    @Schema(description = "현재 페이지의 데이터 목록")
    private List<T> content;

    @Schema(description = "페이지네이션 정보")
    private PageableCustom pageInfo;

    public PageCustom(Page<T> page) {
        this.content = page.getContent();
        this.pageInfo = new PageableCustom(page);
    }
}
