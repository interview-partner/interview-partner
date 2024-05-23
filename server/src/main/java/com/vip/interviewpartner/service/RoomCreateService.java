package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.exception.ErrorCode.*;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.domain.Room;
import com.vip.interviewpartner.domain.Tag;
import com.vip.interviewpartner.dto.RoomCreateRequest;
import com.vip.interviewpartner.dto.RoomCreateResponse;
import com.vip.interviewpartner.repository.MemberRepository;
import com.vip.interviewpartner.repository.RoomRepository;
import com.vip.interviewpartner.repository.TagRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 방 생성을 처리하는 서비스 클래스.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class RoomCreateService {
    private final OpenViduService openViduService;
    private final RoomRepository roomRepository;
    private final TagRepository tagRepository;
    private final MemberRepository memberRepository;

    /**
     * 방을 생성합니다.
     *
     * @param memberId 방 소유자의 멤버 ID
     * @param roomCreateRequest 방 생성 요청 정보
     * @return 생성된 방의 ID를 포함하는 응답 객체
     */
    @Transactional
    public RoomCreateResponse create(Long memberId, RoomCreateRequest roomCreateRequest) {
        Member owner = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND));
        String sessionId = openViduService.createSession();
        Room room = roomCreateRequest.toEntity(owner, sessionId);
        Room savedRoom = roomRepository.save(room);
        addTagsToRoom(roomCreateRequest.getTagIds(), savedRoom);
        return new RoomCreateResponse(savedRoom.getId());
    }

    /**
     * 태그를 방에 추가합니다.
     *
     * @param tagIds 태그 ID 목록
     * @param savedRoom 저장된 방 객체
     */
    private void addTagsToRoom(List<Integer> tagIds, Room savedRoom) {
        for (Integer tagId : tagIds) {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND));
            savedRoom.addTag(tag);
        }
    }
}
