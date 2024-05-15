package com.vip.interviewpartner.service;

import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Resume;
import com.vip.interviewpartner.repository.MemberRepository;
import com.vip.interviewpartner.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Optional;
import java.util.UUID;

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

    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;

    /**
     * 이력서를 업로드하는 매서드 입니다.
     *
     * @param memberId 이력서를 업로드하려는 member의 Id 입니다.
     * @param file PDF 파일을 말합니다.
     */
    @Transactional(readOnly = false)
    public void upload(Long memberId, MultipartFile file){


        String exportedText = exportTextService.exportText(file);
        String originalName = file.getOriginalFilename();
        Path tempFile = stringToTxtService.StringToTxt(exportedText);

        String storedFileName =  UUID.randomUUID().toString() + "-" + originalName;
        String pdfFileKey = "resumes/" + storedFileName;
        String txtFileKey = "texts/" + UUID.randomUUID().toString() + "-" + originalName.replace(".pdf", ".txt");

        String bucketName = "interviewpartnerbucket"; // 미리 생성된 버킷 이름

        try {
            s3UploadService.uploadPdfFile(bucketName, file, pdfFileKey);
            s3UploadService.uploadTxtFile(bucketName, tempFile, txtFileKey);
        } catch (IOException e) {
            // 예외 메시지를 로깅
            System.err.println("An I/O error occurred during S3 upload: " + e.getMessage());
            e.printStackTrace();

            // 사용자에게 예외가 발생했음을 알리는 코드 (예: 리턴 메시지 설정)
            String errorMessage = "Failed to upload files to S3: " + e.getMessage();
            System.out.println(errorMessage);
        }

        // DB 이력서 정보저장
        Optional<Member> member = memberRepository.findById(memberId);
        resumeRepository.save(new Resume(member.get(), originalName, storedFileName, pdfFileKey, txtFileKey));
    }

}
