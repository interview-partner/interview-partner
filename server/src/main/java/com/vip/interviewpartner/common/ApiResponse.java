package com.vip.interviewpartner.common;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

/**
 * API 응답을 표준화하는 클래스입니다.
 * 이 클래스는 API의 성공, 실패, 오류 상태를 일관된 형식으로 클라이언트에 반환합니다.
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ApiResponse<T> {

    private static final String SUCCESS_STATUS = "success";
    private static final String FAIL_STATUS = "fail";
    private static final String ERROR_STATUS = "error";

    private String status;
    private T data;
    private String message;

    /**
     * 성공 응답을 생성합니다.
     *
     * @param data 성공했을 때 클라이언트에 반환할 데이터
     * @return 성공 상태와 데이터를 포함하는 ApiResponse 객체
     */
    public static <T> ApiResponse<T> successResponse(T data) {
        return new ApiResponse<>(SUCCESS_STATUS, data, null);
    }

    /**
     * 내용 없는 성공 응답을 생성합니다.
     *
     * @return 성공 상태만을 포함하는 ApiResponse 객체
     */
    public static ApiResponse<?> successWithNoContent() {
        return new ApiResponse<>(SUCCESS_STATUS, null, null);
    }

    /**
     * 유효성 검사 실패에 대한 응답을 생성합니다.
     *
     * @param bindingResult Spring의 BindingResult 객체, 유효성 검사 실패의 세부 정보를 포함
     * @return 실패 상태와 유효성 검사 오류를 포함하는 ApiResponse 객체
     */
    public static ApiResponse<?> failResponse(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();

        List<ObjectError> allErrors = bindingResult.getAllErrors();
        for (ObjectError error : allErrors) {
            if (error instanceof FieldError fieldError) {
                errors.put(fieldError.getField(), error.getDefaultMessage());
            } else {
                errors.put(error.getObjectName(), error.getDefaultMessage());
            }
        }
        return new ApiResponse<>(FAIL_STATUS, errors, null);
    }

    /**
     * 오류 응답을 생성합니다.
     *
     * @param message 오류 상태에 포함될 메시지
     * @return 오류 상태와 메시지를 포함하는 ApiResponse 객체
     */
    public static ApiResponse<?> errorResponse(String message) {
        return new ApiResponse<>(ERROR_STATUS, null, message);
    }
}
