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
import lombok.Setter;

/**
 * 면접 질문을 저장하는 엔티티입니다.
 * 각 질문은 부모 질문과 Interview에 연결될 수 있으며, 질문 내용과 모범 답안을 포함합니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Question extends BaseCreateDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Question parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id")
    @Setter
    private Interview interview;

    private String content;
    private String modelAnswer;

    public Question(Interview interview, String content){
        this.interview = interview;
        this.content = content;
        this.modelAnswer = "tmp";
    }

    public Question(Interview interview, String content, Question parent){
        this.interview = interview;
        this.parent = parent;
        this.content = content;
        this.modelAnswer = "tmp";
    }
}
