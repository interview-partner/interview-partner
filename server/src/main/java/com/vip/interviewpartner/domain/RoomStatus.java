package com.vip.interviewpartner.domain;

/**
 * 방의 상태를 정의하는 열거형입니다.
 * OPEN: 방이 열려 있으며 사용자가 입장할 수 있는 상태입니다.
 * CLOSED: 방이 닫혀 있으며 더 이상 사용자가 입장할 수 없는 상태입니다.
 * IN_PROGRESS: 방이 활성화되어 있으며 활동이 진행 중인 상태입니다.
 * 각 상태는 방의 생명주기를 관리하는 데 사용됩니다.
 */
public enum RoomStatus {
    OPEN, CLOSED, IN_PROGRESS
}
