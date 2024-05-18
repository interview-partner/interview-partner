package com.vip.interviewpartner.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

/**
 * 사용자의 이력서를 관리하는 엔티티입니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Resume extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String originalFileName;
    private String storedFileName;
    private String filePath;
    private String translatedFilePath;

    @ColumnDefault("true")
    @Column(columnDefinition = "TINYINT(1)", nullable = false)
    private boolean isActive;

    public Resume(Member member, String originalFileName,String storedFileName, String filePath, String translatedFilePath) {
        this.member = member;
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.filePath = filePath;
        this.translatedFilePath = translatedFilePath;
        this.isActive = true;
    }
}
