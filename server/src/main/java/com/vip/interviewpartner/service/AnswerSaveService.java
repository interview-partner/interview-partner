package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Question;
import com.vip.interviewpartner.domain.UserAnswer;
import com.vip.interviewpartner.dto.AnswerSaveRequest;
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

    private final InterviewService interviewService;

    /**
     * 사용자의 답변 저장 요청을 처리합니다.
     *
     * @param memberId 사용자의 Id
     * @param questionId 질문 Id
     * @param answerSaveRequest 프론트 단에서 받은 answerSaveRequest
     */
    @Transactional(readOnly = false)
    public void saveAnswer(Long memberId, Long questionId, AnswerSaveRequest answerSaveRequest){

        Interview interview = questionRepository.findInterviewByQuestionId(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.INTERVIEW_NOT_FOUND));

        interviewService.validateInterviewOwnership(memberId, interview);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        UserAnswer userAnswer = answerSaveRequest.toEntity(question);
        userAnswerRepository.save(userAnswer);
    }
}
