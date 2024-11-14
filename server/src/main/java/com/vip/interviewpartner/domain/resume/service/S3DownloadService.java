package com.vip.interviewpartner.domain.resume.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * S3에서 파일을 받는 서비스
 */
@Service
public class S3DownloadService {
    @Autowired
    private AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    /**
     * 파일키를 토대로 S3에 있는 텍스트를 추출하는 기능을 하는 매서드 입니다.
     *
     * @param fileKey S3 파일키 (txt)
     * @return 문자열 형태의 텍스트
     */
    public String getFileContent(String fileKey) {
        try {
            S3Object s3object = amazonS3Client.getObject(bucketName, fileKey);
            try (S3ObjectInputStream inputStream = s3object.getObjectContent();
                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

                byte[] readBuf = new byte[1024];
                int readLen;
                while ((readLen = inputStream.read(readBuf)) > 0) {
                    outputStream.write(readBuf, 0, readLen);
                }
                return outputStream.toString(StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            throw new CustomException(ErrorCode.S3_READ_FAILURE);
        } catch (AmazonServiceException e) {
            throw new CustomException(ErrorCode.S3_DOWNLOAD_FAILURE);
        }
    }

}
