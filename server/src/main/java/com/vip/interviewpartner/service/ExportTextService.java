package com.vip.interviewpartner.service;

import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExportTextService {


    public String exportText(MultipartFile file) {

        String text = "";

        if (file != null && !file.isEmpty() && file.getContentType().equals("application/pdf")) {
            try {
                // PDF 문서 로드
                PDDocument document = PDDocument.load(file.getInputStream());

                // PDFTextStripper 객체 생성
                PDFTextStripper pdfStripper = new PDFTextStripper();

                // 페이지 범위 지정 (옵션)
                pdfStripper.setStartPage(1);
                pdfStripper.setEndPage(document.getNumberOfPages());

                // PDF에서 텍스트 추출
                text = pdfStripper.getText(document);


                // 문서 닫기
                document.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return text.replaceAll(" |\\r\\n|\\r|\\n", "").trim();
    }
}
