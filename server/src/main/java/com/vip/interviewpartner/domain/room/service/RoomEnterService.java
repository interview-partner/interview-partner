package com.vip.interviewpartner.domain.room.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.member.service.MemberService;
import com.vip.interviewpartner.domain.resume.entity.Resume;
import com.vip.interviewpartner.domain.resume.service.ResumeService;
import com.vip.interviewpartner.domain.room.enitty.Room;
import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
import com.vip.interviewpartner.domain.room.dto.response.RoomEnterUserData;
import com.vip.interviewpartner.domain.room_participant.repository.RoomParticipantRepository;
import com.vip.interviewpartner.domain.room_participant.service.RoomParticipantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RoomEnterService 클래스는 사용자가 방에 입장하는 비즈니스 로직을 처리합니다.
 * 방에 입장하기 위한 데이터 검증, 방 상태 확인, 참가자 저장 등을 담당합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class RoomEnterService {
    private final MemberService memberService;
    private final ResumeService resumeService;
    private final RoomService roomService;
    private final OpenViduService openViduService;
    private final RoomParticipantService roomParticipantService;
    private final RoomParticipantRepository roomParticipantRepository;

    /**
     * 사용자가 방에 입장하는 메서드입니다.
     *
     * @param memberId 회원 ID
     * @param roomId   방 ID
     * @param resumeId 이력서 ID
     * @return 생성된 방 입장 토큰
     * @throws CustomException 방이 가득 찬 경우 발생
     */
    @Transactional
    public String enter(Long memberId, Long roomId, Long resumeId) {
        Member member = memberService.getMemberById(memberId);
        Resume resume = resumeService.getResumeByIdAndValidateOwnership(resumeId, memberId);
        Room room = roomService.getRoomById(roomId);
        validateRoomCapacity(room);
        RoomParticipant roomParticipant = roomParticipantService.save(member, resume, room);
        RoomEnterUserData userData = RoomEnterUserData.create(member, resume, room, roomParticipant);
        return openViduService.createToken(room.getSessionId(), userData.toJson());
    }

    /**
     * 방의 현재 참가자 수를 확인하고, 방이 가득 찼는지 검증합니다.
     * @param room 검증할 방 객체
     * @throws CustomException 방이 가득 찬 경우 발생
     */
    private void validateRoomCapacity(Room room) {
        int currentParticipantCount = roomParticipantRepository.countByRoomIdAndCurrentlyJoined(room.getId());
        if (room.isFull(currentParticipantCount)) {
            throw new CustomException(ErrorCode.ROOM_FULL);
        }
    }

}
