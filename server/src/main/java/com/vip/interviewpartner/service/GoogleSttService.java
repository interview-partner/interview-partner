package com.vip.interviewpartner.service;

import com.google.cloud.speech.v1.RecognitionAudio;
import com.google.cloud.speech.v1.RecognitionConfig;
import com.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import com.google.cloud.speech.v1.RecognizeResponse;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoogleSttService {

    private final SpeechClient speechClient;

    public String transcribe(MultipartFile file) {
        try {
            byte[] data = file.getBytes();

            // RecognitionConfig 설정
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(AudioEncoding.MP3)
                    .setSampleRateHertz(44100)
                    .setLanguageCode("ko-KR")
                    .build();

            // RecognitionAudio 설정
            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(com.google.protobuf.ByteString.copyFrom(data))
                    .build();

            // STT 호출
            RecognizeResponse response = speechClient.recognize(config, audio);
            List<SpeechRecognitionResult> results = response.getResultsList();

            // 결과 추출
            StringBuilder transcript = new StringBuilder();
            for (SpeechRecognitionResult result : results) {
                SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                transcript.append(alternative.getTranscript());
            }

            return transcript.toString();
        } catch (IOException e) {
            throw new CustomException(ErrorCode.STT_PROCESSING_ERROR);
        }
    }
}
