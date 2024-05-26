package com.vip.interviewpartner.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Getter
@NoArgsConstructor
@Schema(description = "페이지네이션 정보를 포함하는 DTO")
public class PageableCustom {

    @Schema(description = "첫 번째 페이지 여부를 나타냅니다")
    private boolean first;

    @Schema(description = "마지막 페이지 여부를 나타냅니다")
    private boolean last;

    @Schema(description = "다음 페이지가 있는지 여부를 나타냅니다")
    private boolean hasNext;

    @Schema(description = "모든 페이지의 총 요소 수")
    private long totalElements;

    @Schema(description = "페이지당 요소 수")
    private int size;

    @Schema(description = "현재 페이지의 요소 수")
    private int numberOfElements;

    @Schema(description = "현재 페이지 번호 (1부터 시작)")
    private int currentPage;

    @Schema(description = "첫 번째 페이지 번호 (항상 1)")
    private int firstPage;

    @Schema(description = "마지막 페이지 번호")
    private int lastPage;

    public PageableCustom(Page<?> page) {
        this.first = page.isFirst();
        this.last = page.isLast();
        this.hasNext = page.hasNext();
        this.totalElements = page.getTotalElements();
        this.size = page.getSize();
        this.numberOfElements = page.getNumberOfElements();
        this.currentPage = page.getNumber() + 1;
        this.firstPage = 1;
        this.lastPage = page.getTotalPages();
    }
}
