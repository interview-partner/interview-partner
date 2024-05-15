package com.vip.interviewpartner.service;

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

    public void upload(Long memberId, MultipartFile file){

        String exportedText = exportTextService.exportText(file);
        String tmpFilePath = stringToTxtService.StringToTxt(exportedText);

        System.out.println("memberId = " + memberId);
        System.out.println("exportTextService = " + exportedText);
        System.out.println("tmpFilePath = " + tmpFilePath);




    }
}
