package com.vip.interviewpartner.domain;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import java.time.LocalDateTime;
import lombok.Getter;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * 생성 날짜와 수정 날짜를 자동으로 관리하는 베이스 엔티티입니다.
 * 이 클래스는 생성 및 수정 날짜를 포함하며, 모든 시간 관련 정보를 자동으로 갱신하는 기능을 제공합니다.
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseTimeEntity extends BaseCreateDateEntity {
    @LastModifiedDate
    private LocalDateTime updateDate;
}
