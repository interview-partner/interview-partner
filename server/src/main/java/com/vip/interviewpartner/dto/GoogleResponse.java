package com.vip.interviewpartner.dto;

import static com.vip.interviewpartner.common.constants.Constants.GOOGLE;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_FIREBASE_ID_TOKEN;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.vip.interviewpartner.common.exception.CustomException;
import lombok.ToString;

/**
 * GoogleResponse 클래스는 Firebase를 통해 Google OAuth2 인증을 처리합니다.
 * idToken을 검증하여 사용자 정보를 추출하고, 이를 OAuth2Response 인터페이스의 메서드로 제공합니다.
 */
@ToString
public class GoogleResponse implements OAuth2Response {
    private final FirebaseToken decodedToken;

    /**
     * 주어진 idToken을 검증하고, 검증된 FirebaseToken을 초기화합니다.
     *
     * @param idToken Firebase ID 토큰
     * @throws CustomException 유효하지 않은 Firebase ID 토큰일 경우 발생
     */
    public GoogleResponse(String idToken) {
        try {
            this.decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new CustomException(INVALID_FIREBASE_ID_TOKEN);
        }
    }

    @Override
    public String getProvider() {
        return GOOGLE;
    }

    @Override
    public String getProviderId() {
        return decodedToken.getUid();
    }

    @Override
    public String getEmail() {
        return decodedToken.getEmail();
    }
}
