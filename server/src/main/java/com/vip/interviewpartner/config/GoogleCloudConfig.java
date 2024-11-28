package com.vip.interviewpartner.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechSettings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class GoogleCloudConfig {

    @Value("${google.cloud.credentials.location}")
    private Resource gcpCredentials;

    @Bean
    public SpeechClient speechClient() throws IOException {
        log.info("Loading Google Cloud credentials from: {}", gcpCredentials.getFilename());

        InputStream credentialsStream = gcpCredentials.getInputStream();
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
        SpeechSettings settings = SpeechSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();
        return SpeechClient.create(settings);
    }
}
