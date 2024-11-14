package com.vip.interviewpartner.domain.question.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.interview.entity.Interview;
import com.vip.interviewpartner.domain.question.entity.Question;
import com.vip.interviewpartner.domain.question.dto.response.TailQuestionResponse;
import com.vip.interviewpartner.domain.question.repository.QuestionRepository;
import com.vip.interviewpartner.domain.user_answer.repository.UserAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * 꼬리 질문을 생성하는 서비스 클래스 입니다.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TailQuestionCreateService {

    private final QuestionRepository questionRepository;
    private final UserAnswerRepository userAnswerRepository;

    private final QuestionCreateService questionCreateService;

    /**
     * 꼬리 질문을 생성하는 메서드 입니다.
     *
     * @param questionId 전 질문의 ID
     * @return 꼬리 질문 내용 content
     */
    @Transactional
    public TailQuestionResponse createTailQuestion(Long memberId, Long questionId){
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        Interview interview = question.getInterview();

        validateInterviewOwnership(interview, memberId);

        String answerContent = userAnswerRepository.findContentByQuestionId(questionId);

        String tailQuestionContent = questionCreateService.tailQuestionRequest(question.getContent(), answerContent);

        Question tailQuestion = new Question(interview, tailQuestionContent, question);
        questionRepository.save(tailQuestion);

        return new TailQuestionResponse(tailQuestionContent);
    }



    public void validateInterviewOwnership(Interview interview, Long memberId){
        if (!interview.getMember().getId().equals(memberId)) {
            throw new CustomException(ErrorCode.MEMBER_ID_MISMATCH);
        }
    }


}
