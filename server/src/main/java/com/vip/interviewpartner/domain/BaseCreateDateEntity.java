package com.vip.interviewpartner.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import java.time.LocalDateTime;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * 모든 엔티티의 기본 클래스로, 생성 날짜를 자동으로 관리합니다.
 * 이 클래스는 모든 엔티티에 공통적으로 사용될 생성 날짜 필드를 포함합니다.
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseCreateDateEntity {
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createDate;
}
