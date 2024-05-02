package com.vip.interviewpartner.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 애플리케이션 정의 예외를 처리하기 위한 사용자 정의 예외 클래스입니다.
 * 이 클래스는 RuntimeException을 상속받아 unchecked 예외로 처리됩니다.
 */
@AllArgsConstructor
@Getter
public class CustomException extends RuntimeException {
    ErrorCode errorCode;
}
