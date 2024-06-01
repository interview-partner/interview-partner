package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Question;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.QuestionLookupResponse;
import com.vip.interviewpartner.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionLookupService {
    private final QuestionRepository questionRepository;
    private final InterviewService interviewService;

    /**
     * 주어진 인터뷰 ID에 해당하는 질문 목록들을 조회합니다.
     *
     * @param interviewId 이력서를 조회할 회원의 ID
     * @return 주어진 인터뷰 ID에 해당하는 질문 목록을 담은 QuestionLookupResponse 리스트
     */
    public List<QuestionLookupResponse> getQuestionsByInterviewId(CustomUserDetails customUserDetails, Long interviewId) {
        interviewService.validateInterviewOwnership(customUserDetails.getMemberId(), interviewId);
        List<Question> questions = questionRepository.findByInterviewId(interviewId);
        if (questions.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        return questions.stream()
                .map(QuestionLookupResponse::of)
                .toList();
    }

}


