package com.vip.interviewpartner.domain;

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

/**
 * 사용자의 면접 답변을 저장하는 엔티티입니다.
 * 각 답변은 특정 질문에 연결되어 있으며, 답변 내용과 오디오 파일 경로를 포함합니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UserAnswer extends BaseCreateDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    private String content;

    private String audioPath;

    public UserAnswer(Question question, String content, String audioPath) {
        this.question = question;
        this.content = content;
        this.audioPath = audioPath;
    }
}
