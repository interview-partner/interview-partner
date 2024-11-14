package com.vip.interviewpartner.domain.resume.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.amazonaws.services.s3.AmazonS3Client;

/**
 * S3UploadService는 Amazon S3에 파일을 업로드하는 서비스입니다.
 */
@Service
public class S3UploadService {

    @Autowired
    private AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    /**
     * PDF 파일을 업로드합니다.
     *
     * @param file 업로드할 PDF 파일
     * @param originalFileKey S3에 저장할 파일 키
     * @throws IOException 파일 업로드 실패 시 예외 발생
     */
    public void uploadPdfFile(MultipartFile file, String originalFileKey) throws IOException {
        if (!getFileExtension(file.getOriginalFilename()).equalsIgnoreCase("pdf")) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }

        File tempFile = convertMultipartFileToFile(file);
        amazonS3Client.putObject(bucketName, originalFileKey, tempFile);
        tempFile.delete();
    }

    /**
     * 텍스트 파일을 업로드합니다.
     *
     * @param tempFile 업로드할 텍스트 파일의 경로
     * @param originalFileKey S3에 저장할 파일 키
     * @throws IOException 파일 업로드 실패 시 예외 발생
     */
    public void uploadTxtFile(Path tempFile, String originalFileKey) throws IOException {
        // Path를 File로 변환
        File fileToUpload = tempFile.toFile();

        // S3에 파일 업로드
        amazonS3Client.putObject(bucketName, originalFileKey, fileToUpload);
    }

    /**
     * 음성 파일을 업로드합니다.
     *
     * @param audioFile 업로드할 음성 파일
     * @return 업로드된 파일의 경로
     * @throws IOException 파일 업로드 실패 시 예외 발생
     */
    public String uploadAnswerAudioFile(MultipartFile audioFile) throws IOException {
        if (!getFileExtension(audioFile.getOriginalFilename()).equalsIgnoreCase("wav")) {
            throw new CustomException(ErrorCode.INVALID_AUDIO_FILE_TYPE);
        }

        String fileKey = "audio/answers/" + UUID.randomUUID() + "-" + audioFile.getOriginalFilename();

        File tempFile = convertMultipartFileToFile(audioFile);

        amazonS3Client.putObject(bucketName, fileKey, tempFile);

        tempFile.delete();

        return fileKey;
    }

    /**
     * 파일의 확장자를 반환합니다.
     *
     * @param fileName 파일 이름
     * @return 파일 확장자
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    /**
     * MultipartFile을 File로 변환합니다.
     *
     * @param file 변환할 MultipartFile
     * @return 변환된 File 객체
     * @throws IOException 파일 변환 실패 시 예외 발생
     */
    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        Files.write(convFile.toPath(), file.getBytes());
        return convFile;
    }
}
