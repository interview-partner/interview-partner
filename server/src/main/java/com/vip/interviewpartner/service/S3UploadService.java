package com.vip.interviewpartner.service;

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

@Service
public class S3UploadService {

    @Autowired
    private AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public void uploadPdfFile(MultipartFile file, String originalFileKey) throws IOException {
        if (!getFileExtension(file.getOriginalFilename()).equalsIgnoreCase("pdf")) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }

        File tempFile = convertMultipartFileToFile(file);
        amazonS3Client.putObject(bucketName, originalFileKey, tempFile);
        tempFile.delete();
    }

    public void uploadTxtFile(Path tempFile, String originalFileKey) throws IOException {
        // Path를 File로 변환
        File fileToUpload = tempFile.toFile();

        // S3에 파일 업로드
        amazonS3Client.putObject(bucketName, originalFileKey, fileToUpload);


    }

    public String uploadAnswerAudioFile(MultipartFile audioFile) throws IOException {
        if (!getFileExtension(audioFile.getOriginalFilename()).equalsIgnoreCase("mp3")) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }

        String fileKey = "audio/answers/" + UUID.randomUUID() + "-" + audioFile.getOriginalFilename();

        File tempFile = convertMultipartFileToFile(audioFile);

        amazonS3Client.putObject(bucketName, fileKey, tempFile);

        tempFile.delete();

        return fileKey;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        Files.write(convFile.toPath(), file.getBytes());
        return convFile;
    }
}
