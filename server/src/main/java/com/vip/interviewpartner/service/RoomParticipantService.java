package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.*;
import static com.vip.interviewpartner.common.exception.ErrorCode.ROOM_PARTICIPANT_NOT_FOUND;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Resume;
import com.vip.interviewpartner.domain.Room;
import com.vip.interviewpartner.domain.RoomParticipant;
import com.vip.interviewpartner.dto.ParticipantDetailsResponse;
import com.vip.interviewpartner.repository.RoomParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RoomParticipantService 클래스는 방 참가자와 관련된 비즈니스 로직을 처리합니다.
 * 주어진 멤버, 이력서, 방 정보를 기반으로 RoomParticipant 객체를 생성하고 저장하는 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomParticipantService {

    private final RoomParticipantRepository roomParticipantRepository;

    /**
     * 주어진 멤버, 이력서, 방 정보를 기반으로 RoomParticipant 객체를 생성하고 저장합니다.
     *
     * @param member 멤버 객체
     * @param resume 이력서 객체
     * @param room   방 객체
     * @return 저장된 RoomParticipant 객체
     */
    @Transactional
    public RoomParticipant save(Member member, Resume resume, Room room) {
        RoomParticipant roomParticipant = RoomParticipant.builder()
                .member(member)
                .room(room)
                .resume(resume)
                .build();
        roomParticipantRepository.save(roomParticipant);
        return roomParticipant;
    }

    /**
     * 주어진 참가자 ID로 RoomParticipant 객체를 조회합니다.
     * 참가자가 존재하지 않을 경우 CustomException을 발생시킵니다.
     *
     * @param participantId 조회할 RoomParticipant의 ID
     * @return 조회된 RoomParticipant 객체
     * @throws CustomException 참가자가 존재하지 않을 경우 발생합니다.
     */
    public RoomParticipant findRoomParticipant(Long participantId) {
        return roomParticipantRepository.findById(participantId)
                .orElseThrow(() -> new CustomException(ROOM_PARTICIPANT_NOT_FOUND));
    }

    /**
     * 주어진 멤버 ID로 RoomParticipant 객체 목록을 페이지로 조회합니다.
     *
     * @param memberId 조회할 멤버의 ID
     * @param pageable 페이징 정보
     * @return 페이징된 RoomParticipant 객체 목록
     */
    public Page<RoomParticipant> findByMemberId(Long memberId, Pageable pageable) {
        return roomParticipantRepository.findByMemberId(memberId, pageable);
    }

    /**
     * 주어진 멤버 ID와 참가자 ID로 RoomParticipant의 세부 정보를 조회합니다.
     * 소유권 검증을 통해 접근 권한을 확인합니다.
     *
     * @param memberId 조회할 멤버의 ID
     * @param participantId 조회할 RoomParticipant의 ID
     * @return RoomParticipant의 세부 정보를 담은 ParticipationDetailsDTO 객체
     */
    public ParticipantDetailsResponse findRoomParticipantDetails(Long memberId, Long participantId) {
        RoomParticipant roomParticipant = roomParticipantRepository.findWithDetailsById(participantId)
                .orElseThrow(() -> new CustomException(ROOM_PARTICIPANT_NOT_FOUND));
        validateMemberOwnership(memberId, roomParticipant);
        return ParticipantDetailsResponse.of(roomParticipant, roomParticipant.getRoom(), roomParticipant.getResume());
    }

    /**
     * 주어진 멤버 ID와 RoomParticipant 객체의 소유권을 검증합니다.
     * 소유자가 일치하지 않을 경우 CustomException을 발생시킵니다.
     *
     * @param memberId 검증할 멤버의 ID
     * @param roomParticipant 검증할 RoomParticipant 객체
     * @throws CustomException 소유자가 일치하지 않을 경우 발생합니다.
     */
    public void validateMemberOwnership(Long memberId, RoomParticipant roomParticipant) {
        if (!roomParticipant.getMember().getId().equals(memberId)) {
            throw new CustomException(FORBIDDEN);
        }
    }
}
