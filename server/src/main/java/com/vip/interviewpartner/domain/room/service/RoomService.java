package com.vip.interviewpartner.domain.room.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.room.enitty.Room;
import com.vip.interviewpartner.domain.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RoomService 클래스는 Room 객체와 관련된 비즈니스 로직을 처리합니다.
 * 이 클래스는 RoomRepository를 사용하여 데이터베이스와 상호 작용합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
    private final RoomRepository roomRepository;

    /**
     * 주어진 ID로 Room 객체를 조회합니다.
     * 만약 해당 ID의 Room 객체를 찾지 못하면 CustomException을 발생시킵니다.
     *
     * @param roomId 조회할 Room 객체의 ID
     * @return 조회된 Room 객체
     * @throws CustomException 해당 ID의 Room 객체를 찾지 못한 경우 발생
     */
    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
    }
}
