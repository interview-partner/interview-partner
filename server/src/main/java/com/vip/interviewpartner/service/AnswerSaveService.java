package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Question;
import com.vip.interviewpartner.domain.UserAnswer;
import com.vip.interviewpartner.dto.AnswerSaveRequest;
import com.vip.interviewpartner.dto.AudioAnswerResponse;
import com.vip.interviewpartner.repository.QuestionRepository;
import com.vip.interviewpartner.repository.UserAnswerRepository;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * AnswerSaveService는 질문에 대한 답변을 저장하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerSaveService {
    private final InterviewService interviewService;
    private final S3UploadService s3UploadService;
    private final GoogleSttService googleSttService;

    private final QuestionRepository questionRepository;
    private final UserAnswerRepository userAnswerRepository;


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

    /**
     * 사용자의 음성 답변 저장 요청을 처리합니다.
     *
     * @param memberId 사용자의 ID
     * @param questionId 질문 ID
     * @param audioFile 음성 파일
     * @return AudioAnswerResponse 음성 파일 경로와 변환된 텍스트를 담은 응답 객체
     */
    @Transactional
    public AudioAnswerResponse saveAudioAnswer(Long memberId, Long questionId, MultipartFile audioFile) {
        Interview interview = questionRepository.findInterviewByQuestionId(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.INTERVIEW_NOT_FOUND));

        interviewService.validateInterviewOwnership(memberId, interview);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        String audioPath = null;
        try {
            audioPath = s3UploadService.uploadAnswerAudioFile(audioFile);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.UPLOAD_FAILURE);
        }

        String transcript = googleSttService.transcribe(audioFile);
        AnswerSaveRequest answerSaveRequest = new AnswerSaveRequest(transcript, audioPath);
        UserAnswer userAnswer = answerSaveRequest.toEntity(question);
        userAnswerRepository.save(userAnswer);
        return new AudioAnswerResponse(transcript, audioPath);
    }
}
