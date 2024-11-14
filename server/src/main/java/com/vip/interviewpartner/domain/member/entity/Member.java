package com.vip.interviewpartner.domain.member.entity;

import com.vip.interviewpartner.domain.base.BaseTimeEntity;
import com.vip.interviewpartner.domain.member.dto.request.MemberUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

/**
 * 사용자의 기본 정보를 저장하는 엔티티입니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "member", uniqueConstraints = {
        @UniqueConstraint(name = "UK_EMAIL", columnNames = {"email"}),
        @UniqueConstraint(name = "UK_NICKNAME", columnNames = {"nickname"})
})
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String email;

    private String password;

    @Column(nullable = false)
    private String nickname;

    private String provider;
    private String providerId;

    @ColumnDefault("true")
    @Column(columnDefinition = "TINYINT(1)", nullable = false)
    private boolean isActive;

    @Column(columnDefinition = "varchar(255)", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    public Member(Long id, String nickname, Role role) {
        this.id = id;
        this.nickname = nickname;
        this.role = role;
    }

    @Builder
    public Member(String email, String password, String nickname, String provider, String providerId) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.provider = provider;
        this.providerId = providerId;
        this.isActive = true;
        this.role = Role.ROLE_USER;
    }

    public void updateInfo(MemberUpdateRequest request) {
        this.nickname = request.getNickname();
    }
}
