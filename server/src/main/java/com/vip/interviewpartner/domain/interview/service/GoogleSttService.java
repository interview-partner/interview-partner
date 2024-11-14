package com.vip.interviewpartner.domain.interview.service;

import static com.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16;

import com.google.cloud.speech.v1.RecognitionAudio;
import com.google.cloud.speech.v1.RecognitionConfig;
import com.google.cloud.speech.v1.RecognizeResponse;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import javazoom.jl.decoder.Bitstream;
import javazoom.jl.decoder.Header;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * GoogleSttService는 Google Cloud Speech-to-Text API를 사용하여 음성 파일을 텍스트로 변환하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
public class GoogleSttService {

    private final SpeechClient speechClient;

    /**
     * 음성 파일을 텍스트로 변환합니다.
     *
     * @param file 변환할 음성 파일
     * @return 변환된 텍스트
     */
    public String transcribe(MultipartFile file) {
        try {
            validateAudioDuration(file);
            byte[] data = file.getBytes();

            // RecognitionConfig 설정
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(LINEAR16)
                    .setSampleRateHertz(16000)
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

    /**
     * 음성 파일의 길이를 검증합니다.
     *
     * @param file 검증할 음성 파일
     */
    private void validateAudioDuration(MultipartFile file) {
        try {
            File tempFile = convertMultipartFileToFile(file);
            float durationInSeconds = getAudioDuration(tempFile);
            if (durationInSeconds > 60) {
                throw new CustomException(ErrorCode.AUDIO_FILE_TOO_LONG);
            }
        } catch (Exception e) {
            throw new CustomException(ErrorCode.UPLOAD_FAILURE);
        }
    }

    /**
     * 음성 파일의 길이를 반환합니다.
     *
     * @param file 길이를 계산할 음성 파일
     * @return 음성 파일의 길이 (초 단위)
     * @throws Exception 음성 파일 길이 계산 실패 시 예외 발생
     */
    private float getAudioDuration(File file) throws Exception {
        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            Bitstream bitstream = new Bitstream(fileInputStream);
            Header header = bitstream.readFrame();
            int totalFrames = 0;
            float totalDuration = 0;
            while (header != null) {
                totalDuration += header.ms_per_frame();
                totalFrames++;
                bitstream.closeFrame();
                header = bitstream.readFrame();
            }
            return totalDuration / 1000;
        }
    }

    /**
     * MultipartFile을 File로 변환합니다.
     *
     * @param file 변환할 MultipartFile
     * @return 변환된 File 객체
     * @throws IOException 파일 변환 실패 시 예외 발생
     */
    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("temp", null);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }
        return tempFile;
    }
}
