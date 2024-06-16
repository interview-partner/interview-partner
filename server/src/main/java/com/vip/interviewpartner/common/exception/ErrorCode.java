package com.vip.interviewpartner.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 애플리케이션에서 사용할 오류 코드를 정의하는 열거형입니다. 각 코드는 오류를 구분하는 유니크한 메시지와 HTTP 상태 코드를 포함합니다.
 */
@AllArgsConstructor
@Getter
public enum ErrorCode {
    INVALID_REQUEST(400, "유효하지 않는 요청입니다."),
    RESUME_NOT_FOUND(400, "유효하지 않은 이력서입니다."),
    S3_READ_FAILURE(400, "S3 객체를 읽는 중 오류가 발생했습니다."),
    S3_DOWNLOAD_FAILURE(400, "S3 객체를 다운받는 중 오류가 발생했습니다."),
    GPT_REQUEST_FAILURE(400, "GPT API 리퀘스트 중 오류가 발생했습니다."),
    FILE_EMPTY(400, "파일이 존재하지 않습니다."),
    UPLOAD_FAILURE(400, "업로드에 실패했습니다."),
    MEMBER_NOT_FOUND(400, "유효하지 않은 멤버입니다."),
    ROOM_PARTICIPANT_NOT_FOUND(400, "유효하지 않은 방 참가자입니다."),
    UNSUPPORTED_SOCIAL_MEDIA(400, "지원하지 않는 소셜 미디어입니다."),
    INVALID_FIREBASE_ID_TOKEN(400, "유효하지 않는 Firebase 토큰입니다."),
    QUESTION_NOT_FOUND(400, "유효하지 않는 질문입니다."),
    INTERVIEW_NOT_FOUND(400, "유효하지 않는 인터뷰 입니다."),
    AUTHENTICATION_REQUIRED(401, "인증이 필요합니다."),
    LOGIN_FAILURE(401, "로그인에 실패했습니다."),
    ACCESS_TOKEN_EXPIRED(401, "엑세스 토큰이 만료되었습니다."),
    REFRESH_TOKEN_EXPIRED(401, "리프레쉬 토큰이 만료되었습니다."),
    INVALID_TOKEN(401, "유효하지 않는 토큰입니다."),
    REFRESH_TOKEN_NOT_EXIST(401, "리프레쉬 토큰이 존재하지 않습니다."),
    FORBIDDEN(403, "권한이 없습니다."),
    MEMBER_ID_MISMATCH(403, "요청자와 인터뷰의 소유자가 일치하지 않습니다."),
    RESOURCE_NOT_FOUND(404, "요청한 리소스가 존재하지 않습니다."),
    DUPLICATE_EMAIL(409, "Email is already in use."),
    DUPLICATE_NICKNAME(409, "Nickname is already in use."),
    DUPLICATE_TAG_NAME(409, "이미 존재하는 태그 이름입니다."),
    ROOM_FULL(409, "방이 꽉 찼습니다."),
    DUPLICATE_FEEDBACK(409, "동일한 참가자에게 중복된 피드백을 작성할 수 없습니다."),
    ROOM_CLOSED(410, "방이 종료되었습니다."),
    INVALID_FILE_TYPE(415, "PDF 파일만 업로드 가능합니다."),
    SERVER_ERROR(500, "서버에 에러가 발생하였습니다."),
    STT_PROCESSING_ERROR(500, "STT 처리 중 오류가 발생했습니다."),
    OPENVIDU_SERVER_ERROR(500, "OpenVidu 서버에 에러가 발생하였습니다.");

    private final int status;
    private final String message;
}
