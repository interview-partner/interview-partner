package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.SERVER_ERROR;

import com.vip.interviewpartner.common.exception.CustomException;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * OpenVidu 서비스를 처리하는 서비스 클래스.
 * OpenVidu 서버와의 통신을 담당합니다.
 *
 * This project includes code from the OpenVidu project (https://openvidu.io), which is licensed under the Apache License 2.0.
 *
 * (C) Copyright 2017-2022 OpenVidu (https://openvidu.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * This project includes code from the OpenVidu project (https://openvidu.io).
 */
@Service
@Slf4j
public class OpenViduService {
    @Value("${openvidu.url}")
    private String openviduUrl;

    @Value("${openvidu.secret}")
    private String secret;

    private OpenVidu openVidu;

    @PostConstruct
    public void init() {
        this.openVidu = new OpenVidu(openviduUrl, secret);
    }

    /**
     * 새로운 세션을 생성합니다.
     *
     * @return 생성된 세션의 세션 ID
     * @throws CustomException 서버 오류가 발생한 경우
     */
    public String createSession() {
        try {
            SessionProperties properties = SessionProperties.fromJson(null).build();
            Session session = openVidu.createSession(properties);
            return session.getSessionId();
        } catch (OpenViduJavaClientException e) {
            throw new CustomException(SERVER_ERROR);
        } catch (OpenViduHttpException e) {
            throw new CustomException(SERVER_ERROR);
        }
    }
}
