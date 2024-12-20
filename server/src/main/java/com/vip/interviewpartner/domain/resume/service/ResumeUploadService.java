package com.vip.interviewpartner.domain.resume.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.UPLOAD_FAILURE;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.member.service.MemberService;
import com.vip.interviewpartner.domain.resume.entity.Resume;
import com.vip.interviewpartner.domain.resume.repository.ResumeRepository;
import java.io.IOException;
import java.nio.file.Path;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * 이력서 관련 서비스들을 제공하는 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResumeUploadService {

    private final ExportTextService exportTextService;
    private final StringToTxtService stringToTxtService;
    private final S3UploadService s3UploadService;
    private final MemberService memberService;
    private final ResumeRepository resumeRepository;

    /**
     * 이력서를 업로드하는 매서드 입니다.
     *
     * @param memberId 이력서를 업로드하려는 member의 Id 입니다.
     * @param file     PDF 파일을 말합니다.
     */
    @Transactional
    public void upload(Long memberId, MultipartFile file) {
        String exportedText = exportTextService.exportText(file);
        String originalName = file.getOriginalFilename();
        Path tempFile = stringToTxtService.StringToTxt(exportedText);

        String storedFileName = UUID.randomUUID().toString() + "-" + originalName;
        String pdfFileKey = "resumes/" + storedFileName;
        String txtFileKey = "texts/" + UUID.randomUUID().toString() + "-" + originalName.replace(".pdf", ".txt");

        try {
            s3UploadService.uploadPdfFile(file, pdfFileKey);
            s3UploadService.uploadTxtFile(tempFile, txtFileKey);
        } catch (IOException e) {
            throw new CustomException(UPLOAD_FAILURE);
        }
        String cloudFrontPdfUrl = s3UploadService.generateCloudFrontUrl(pdfFileKey);
        // DB 이력서 정보저장
        Member member = memberService.getMemberById(memberId);
        resumeRepository.save(new Resume(member, originalName, storedFileName, cloudFrontPdfUrl, txtFileKey));
    }

}
