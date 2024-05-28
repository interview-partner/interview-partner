/**
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
 *
 * This project includes code from the OpenVidu project (https://openvidu.io).
 */

package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.OPENVIDU_SERVER_ERROR;
import static com.vip.interviewpartner.common.exception.ErrorCode.ROOM_CLOSED;

import com.vip.interviewpartner.common.exception.CustomException;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
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
 * OpenVidu 서비스를 처리하는 서비스 클래스입니다.
 * OpenVidu 서버와의 통신을 담당합니다.
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
     * @throws CustomException 서버 오류가 발생한 경우 발생
     */
    public String createSession() {
        try {
            SessionProperties properties = SessionProperties.fromJson(null).build();
            Session session = openVidu.createSession(properties);
            return session.getSessionId();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw handleOpenViduException(e);
        }
    }

    /**
     * 특정 세션의 연결 수를 반환합니다.
     *
     * @param sessionId 조회할 세션의 ID
     * @return 세션에 연결된 연결 수
     * @throws CustomException 서버 오류가 발생한 경우 발생
     */
    public int getSessionConnectionCount(String sessionId) {
        Session session = openVidu.getActiveSession(sessionId);
        try {
            if (session != null) {
                session.fetch();
                return session.getConnections().size();
            } else {
                return 0;
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw handleOpenViduException(e);
        }
    }

    /**
     * 주어진 세션 ID와 사용자 데이터를 기반으로 OpenVidu 토큰을 생성합니다.
     *
     * @param sessionId OpenVidu 세션 ID
     * @param userData 토큰에 포함할 사용자 데이터
     * @return 생성된 OpenVidu 토큰
     * @throws CustomException 세션이 닫혀 있거나 서버 오류가 발생한 경우 발생
     */
    public String createToken(String sessionId, String userData) {
        try {
            Session session = openVidu.getActiveSession(sessionId);
            if (session == null) {
                throw new CustomException(ROOM_CLOSED);
            }
            ConnectionProperties properties = new ConnectionProperties.Builder()
                    .data(userData)
                    .build();
            Connection connection = session.createConnection(properties);
            return connection.getToken();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw handleOpenViduException(e);
        }
    }

    /**
     * OpenVidu 예외를 처리하여 CustomException으로 변환합니다.
     *
     * @param e 처리할 OpenVidu 예외
     * @return 변환된 CustomException
     */
    private CustomException handleOpenViduException(Exception e) {
        log.error("OpenVidu error: {}", e.getMessage(), e);
        return new CustomException(OPENVIDU_SERVER_ERROR);
    }
}
