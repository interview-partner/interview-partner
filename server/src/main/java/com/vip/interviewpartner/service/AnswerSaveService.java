package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Question;
import com.vip.interviewpartner.domain.UserAnswer;
import com.vip.interviewpartner.dto.AnswerSaveRequest;
import com.vip.interviewpartner.repository.InterviewRepository;
import com.vip.interviewpartner.repository.QuestionRepository;
import com.vip.interviewpartner.repository.UserAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * SaveAnswerService는 질문에 대한 답변을 저장하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerSaveService {

    private final QuestionRepository questionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final InterviewRepository interviewRepository;

    private final InterviewService interviewService;

    @Transactional(readOnly = false)
    public void saveAnswer(Long memberId, Long questionId, AnswerSaveRequest answerSaveRequest){

        Interview interview = interviewRepository.findByQuestionsId(questionId);

        interviewService.validateInterviewOwnership(memberId, interview.getId());

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        UserAnswer userAnswer = answerSaveRequest.toEntity(question);
        userAnswerRepository.save(userAnswer);
    }
}
