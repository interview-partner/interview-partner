package com.vip.interviewpartner.service;

import com.vip.interviewpartner.domain.Room;
import com.vip.interviewpartner.domain.RoomStatus;
import com.vip.interviewpartner.dto.RoomResponseDTO;
import com.vip.interviewpartner.repository.RoomRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RoomLookupService는 방의 상태에 따라 방 목록을 조회하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomLookupService {

    private final OpenViduService openViduService;
    private final RoomRepository roomRepository;

    /**
     * 주어진 상태의 방 목록을 조회합니다.
     *
     * @param roomStatus 조회할 방의 상태
     * @param pageable 페이징 정보
     * @return 주어진 상태의 방 목록
     */
    public List<RoomResponseDTO> getRoomsByStatus(RoomStatus roomStatus, Pageable pageable) {
        Page<Room> rooms = roomRepository.findByStatus(roomStatus, pageable);
        if (roomStatus == RoomStatus.OPEN) {
            return rooms.stream()
                    .map(room -> RoomResponseDTO.of(room, openViduService.getSessionConnectionCount(room.getSessionId())))
                    .toList();
        }
        return rooms.stream()
                .map(room -> RoomResponseDTO.of(room, 0))
                .toList();
    }
}
