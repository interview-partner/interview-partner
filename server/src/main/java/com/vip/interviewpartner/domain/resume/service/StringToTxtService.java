package com.vip.interviewpartner.domain.resume.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;


/**
 * 추출한 스트링을 txt로 저장하는 서비스를 제공하는 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StringToTxtService {

    /**
     * 스트링을 텍스트 파일로 만드는 매서드입니다.
     * 랜덤으로 파일 Path를 만들어 리소스에 임시파일을 저장합니다.
     *
     * @param str 추출된 텍스트
     * @return 랜덤 파일 Path
     */
    public Path StringToTxt(String str) {

        // 임시 파일 생성 및 쓰기 메서드 호출
        Path tempFile = null;
        try {
            tempFile = createTempFileWithContent(str);
        } catch (IOException e) {
            System.err.println("An I/O error occurred: " + e.getMessage());
            e.printStackTrace();
        } catch (SecurityException e) {
            System.err.println("A security error occurred: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("An unexpected error occurred: " + e.getMessage());
            e.printStackTrace();
        }

        return tempFile;
    }


    /**
     * 주어진 내용을 임시 파일에 작성하고 파일의 경로를 반환하는 메서드.
     *
     * @param content 파일에 쓸 내용
     * @return 생성된 임시 파일의 경로
     * @throws IOException
     */
    public Path createTempFileWithContent(String content) throws IOException {
        // 운영체제의 기본 임시 디렉터리에 임시 파일 생성
        Path tempFile = Files.createTempFile("tempFile_", ".txt");

        // 파일에 내용 쓰기
        Files.write(tempFile, content.getBytes());

        // JVM 종료 시 파일 삭제 예약
        tempFile.toFile().deleteOnExit();
        return tempFile;
    }
}
