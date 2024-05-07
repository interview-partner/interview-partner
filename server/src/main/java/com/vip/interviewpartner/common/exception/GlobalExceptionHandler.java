package com.vip.interviewpartner.common.exception;

import com.vip.interviewpartner.common.ApiCommonResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 애플리케이션에서 발생하는 예외들을 전역적으로 처리하는 핸들러입니다. 이 클래스는 REST 컨트롤러에서 발생할 수 있는 예외들을 적절히 포착하여 정해진 응답 형태로 변환합니다.
 *
 * @RestControllerAdvice 어노테이션을 통해 모든 컨트롤러에 대한 예외를 처리합니다.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * RuntimeException을 처리합니다. 이 메서드는 시스템 내부에서 발생하는 예상치 못한 예외들을 처리하고, 내부 서버 오류를 클라이언트에 알립니다.
     *
     * @param e 발생한 RuntimeException
     * @return 상태 코드 500과 함께 오류 메시지를 포함한 ApiResponse 객체
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiCommonResponse<?>> handleException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiCommonResponse.errorResponse(e.getMessage()));
    }

    /**
     * CustomException을 처리합니다. CustomException에는 개발자가 정의한 에러 코드가 포함되어 있으며, 이를 바탕으로 상세한 오류 응답을 제공합니다.
     *
     * @param e 발생한 CustomException
     * @return CustomException에 정의된 HTTP 상태 코드와 에러 메시지를 포함한 ApiResponse 객체
     */
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiCommonResponse<?>> handleCustomException(CustomException e) {
        return ResponseEntity.status(e.getErrorCode().getStatus()).body(ApiCommonResponse.errorResponse(e.errorCode.getMessage()));
    }

    /**
     * 입력 값 검증 실패(MethodArgumentNotValidException)를 처리합니다. 이 메서드는 입력 값에 대한 검증 실패 시 발생하는 예외를 캡처하고, 상세한 검증 오류 정보를 클라이언트에 반환합니다.
     *
     * @param e 발생한 MethodArgumentNotValidException
     * @return 상태 코드 400과 함께 검증 오류의 세부 정보를 포함한 ApiResponse 객체
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiCommonResponse<?>> handleValidationExceptions(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiCommonResponse.failValidResponse(bindingResult));
    }

    /**
     * Bean Validation에서 제약 조건 위반을 감지했을 때 발생하는 예외(ConstraintViolationException)를 처리합니다.
     *
     * @param e 발생한 ConstraintViolationException
     * @return 상태 코드 400과 함께 검증 오류의 세부 정보를 포함한 ApiResponse 객체
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiCommonResponse<?>> handleConstraintValidationException(ConstraintViolationException e) {
        Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiCommonResponse.failValidatedResponse(violations));
    }
}
