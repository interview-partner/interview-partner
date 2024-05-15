package com.vip.interviewpartner.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;

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
    public String StringToTxt(String str) {

        String randomPath = "src/main/resources/" + generateRandomString() + ".txt";

        try {
            FileWriter writer = new FileWriter(randomPath);  // FileWriter 객체 생성
            writer.write(str);  // 파일에 문자열 쓰기
            writer.close();  // 파일 닫기
        } catch (IOException e) {
            e.printStackTrace();
        }

        return randomPath;
    }

    /**
     * 랜덤 스트링 10자를 만드는 매서드입니다.
     *
     * @return 랜덤 스트링 10자
     */
    public String generateRandomString() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(10);

        for (int i = 0; i < 10; i++) {
            int randomIndex = random.nextInt(characters.length());
            char randomChar = characters.charAt(randomIndex);
            sb.append(randomChar);
        }

        return sb.toString();
    }
}
