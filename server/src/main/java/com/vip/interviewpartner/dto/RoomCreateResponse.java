package com.vip.interviewpartner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 방 생성의 응답을 위한 DTO 클래스입니다.
 */
@Getter
@AllArgsConstructor
public class RoomCreateResponse {
    private Long roomId;
}
