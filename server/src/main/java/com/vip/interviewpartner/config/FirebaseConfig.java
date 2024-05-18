package com.vip.interviewpartner.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * FirebaseConfig 클래스는 Firebase SDK를 설정하고 초기화하는 Spring 설정 클래스입니다.
 * 이 클래스는 Firebase 인증을 위해 FirebaseApp 및 FirebaseAuth 객체를 빈으로 등록합니다.
 */
@Configuration
public class FirebaseConfig {
    @Value("${firebase.service-account.path}")
    private String serviceAccountPath;

    /**
     * FirebaseApp 빈을 생성하고 초기화합니다.
     *
     * @return 초기화된 FirebaseApp 객체
     * @throws IOException 서비스 계정 파일을 읽는 동안 오류가 발생한 경우
     */
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream(serviceAccountPath);
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
        return FirebaseApp.initializeApp(options);
    }

    /**
     * FirebaseAuth 빈을 생성합니다.
     *
     * @return FirebaseAuth 인스턴스
     * @throws IOException FirebaseApp 초기화 중 오류가 발생한 경우
     */
    @Bean
    public FirebaseAuth getFirebaseAuth() throws IOException {
        return FirebaseAuth.getInstance(firebaseApp());
    }
}
