package com.vip.interviewpartner.domain.interview.entity;

import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.question.entity.Question;
import com.vip.interviewpartner.domain.resume.entity.Resume;
import com.vip.interviewpartner.domain.base.BaseTimeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * AI 면접 정보를 저장하는 엔티티입니다.
 * 각 면접은 특정 멤버와 이력서에 연결되며, 면접에 관련된 질문들을 관리할 수 있습니다.
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Interview extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String jobAdvertisement;

    private String interviewType;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    /**
     * Question 객체를 현재 Interview의 질문 목록에 추가합니다.
     *
     * @param question
     */
    public void addQuestion(Question question) {
        if(!questions.contains(question)) {
            questions.add(question);
            question.setInterview(this);
        }
    }

    public Interview( Member member, Resume resume, String interviewType, String jobAdvertisement, String title ) {
        this.interviewType = interviewType;
        this.jobAdvertisement = jobAdvertisement;
        this.title = title;
        this.resume = resume;
        this.member = member;
    }
}
