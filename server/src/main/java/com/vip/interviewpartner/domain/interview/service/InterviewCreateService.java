package com.vip.interviewpartner.domain.interview.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.interview.dto.request.InterviewCreateRequest;
import com.vip.interviewpartner.domain.interview.entity.Interview;
import com.vip.interviewpartner.domain.interview.repository.InterviewRepository;
import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.member.repository.MemberRepository;
import com.vip.interviewpartner.domain.question.entity.Question;
import com.vip.interviewpartner.domain.question.service.QuestionCreateService;
import com.vip.interviewpartner.domain.resume.entity.Resume;
import com.vip.interviewpartner.domain.resume.repository.ResumeRepository;
import com.vip.interviewpartner.domain.resume.service.S3DownloadService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * AI 면접을 생성하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InterviewCreateService {
    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;
    private final InterviewRepository interviewRepository;
    private final S3DownloadService s3DownloadService;
    private final QuestionCreateService makingQuestionService;

    /**
     * AI 인터뷰를 생성을 처리하는 매서드입니다.
     *
     * @param memberId               jwt 인증통해 받은 memberId
     * @param interviewCreateRequest 프론트 단에서 받은 aiInterviewRequest
     * @return Interview_id를 반환
     */
    @Transactional
    public Long create(Long memberId, InterviewCreateRequest interviewCreateRequest) {
        // DB 이력서 정보저장
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        Resume resume = resumeRepository.findById(interviewCreateRequest.getResumeId())
                .orElseThrow(() -> new CustomException(ErrorCode.RESUME_NOT_FOUND));

        Interview interview = interviewCreateRequest.toEntity(member, resume);

        interviewRepository.save(interview);

        String resumeTxt = s3DownloadService.getFileContent(resume.getTranslatedFilePath());

        List<Question> questions = makingQuestionService.create(interview, resumeTxt,
                interviewCreateRequest.getQuestionNumber());
        interview.addQuestions(questions);
        return interview.getId();
    }
}
