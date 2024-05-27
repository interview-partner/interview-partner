package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Question;
import com.vip.interviewpartner.domain.Resume;
import com.vip.interviewpartner.dto.AiInterviewRequest;
import com.vip.interviewpartner.repository.InterviewRepository;
import com.vip.interviewpartner.repository.MemberRepository;
import com.vip.interviewpartner.repository.QuestionRepository;
import com.vip.interviewpartner.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AI 면접을 생성하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiInterviewCreateService {
    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;
    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final S3DownloadService s3DownloadService;
    private final QuestionMakingService makingQuestionService;

    /**
     * AI 인터뷰를 생성을 처리하는 매서드입니다.
     *
     * @param memberId jwt 인증통해 받은 memberId
     * @param aiInterviewRequest 프론트 단에서 받은 aiInterviewRequest
     * @return Interview_id를 반환
     */
    @Transactional(readOnly = false)
    public Long create(Long memberId, AiInterviewRequest aiInterviewRequest) {
        // DB 이력서 정보저장
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        Resume resume = resumeRepository.findById(aiInterviewRequest.getResumeId())
                .orElseThrow(() -> new CustomException(ErrorCode.RESUME_NOT_FOUND));

        Interview interview = aiInterviewRequest.toEntity(member, resume);

        interviewRepository.save(interview);

        String resumeTxt = s3DownloadService.getFileContent(resume.getTranslatedFilePath());

        List<String> contents = makingQuestionService.make(resumeTxt,aiInterviewRequest.getQuestionNumber());

        for(String content : contents){
            Question question = new Question(interview, content);
            questionRepository.save(question);
            interview.addQuestion(question);
        }

        return interview.getId();
    }
}
