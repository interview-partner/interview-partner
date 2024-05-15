package com.vip.interviewpartner.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.amazonaws.services.s3.AmazonS3Client;

@Service
public class S3UploadService {

    @Autowired
    private AmazonS3Client amazonS3Client;

    public void uploadPdfFile(String bucketName, MultipartFile file, String originalFileKey) throws IOException {
        if (!getFileExtension(file.getOriginalFilename()).equalsIgnoreCase("pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed.");
        }

        File tempFile = convertMultipartFileToFile(file);
        amazonS3Client.putObject(bucketName, originalFileKey, tempFile);
        tempFile.delete();
    }

    public void uploadTxtFile(String bucketName, Path tempFile, String originalFileKey) throws IOException {
        // Path를 File로 변환
        File fileToUpload = tempFile.toFile();

        // S3에 파일 업로드
        amazonS3Client.putObject(bucketName, originalFileKey, fileToUpload);


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
