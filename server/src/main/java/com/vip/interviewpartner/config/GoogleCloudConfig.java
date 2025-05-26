package com.vip.interviewpartner.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechSettings;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class GoogleCloudConfig {

    @Value("${google.cloud.credentials.encoded}")
    private String base64EncodedCredentials;

    @Bean
    public SpeechClient speechClient() throws IOException {
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(base64EncodedCredentials);
        ByteArrayInputStream credentialsStream = new ByteArrayInputStream(decodedBytes);

        // GoogleCredentials 객체 생성
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
        SpeechSettings settings = SpeechSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();

        log.info("Google Cloud SpeechClient successfully created.");
        return SpeechClient.create(settings);
    }
}
