package com.vip.interviewpartner.common.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 프로젝트 전반에서 사용되는 공통 상수를 정의한 유틸리티 클래스입니다.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class Constants {
    //JWT 토큰
    public static final String ACCESS = "access";
    public static final String REFRESH = "refresh";
    public static final String REFRESH_TOKEN = "refreshToken";
    public static final long ACCESS_TOKEN_EXPIRATION_TIME = 1800000L; // 30분
    public static final long REFRESH_TOKEN_EXPIRATION_TIME = 1209600000L; // 2주
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_TOKEN_PREFIX = "Bearer ";
    public static final int COOKIE_REFRESH_EXPIRATION_SECONDS = 14 * 24 * 60 * 60; // 2주

    //social login 관련
    public static final String NAVER = "naver";
    public static final String KAKAO = "kakao";
    public static final String GOOGLE = "google";
    public static final String ID_TOKEN = "idToken";

    //Openvidu 관련
    public static final String EVENT = "event";
    public static final String SESSION_ID = "sessionId";
    public static final String SERVER_DATA = "serverData";
    public static final String DATA = "data";
    public static final String CHAT = "chat";
    public static final String TYPE = "type";

}
