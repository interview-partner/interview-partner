package com.vip.interviewpartner.domain.room.dto.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.member.entity.Member;
import com.vip.interviewpartner.domain.resume.entity.Resume;
import com.vip.interviewpartner.domain.room.enitty.Room;
import com.vip.interviewpartner.domain.room_participant.entity.RoomParticipant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

/**
 * RoomEnterUserData 클래스는 사용자가 방에 입장할 때 필요한 데이터를 담는 DTO입니다.
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
@Getter
@ToString
public class RoomEnterUserData {
    private Long memberId;
    private Long roomId;
    private Long resumeId;
    private Long roomParticipantId;
    private String nickname;
    private String resumeUrl;

    /**
     * 주어진 멤버, 이력서, 방, 방 참가자 정보를 기반으로 RoomEnterUserData 객체를 생성합니다.
     *
     * @param member 멤버 객체
     * @param resume 이력서 객체
     * @param room 방 객체
     * @param roomParticipant 방 참가자 객체
     * @return 생성된 RoomEnterUserData 객체
     */
    public static RoomEnterUserData create(Member member, Resume resume, Room room, RoomParticipant roomParticipant) {
        return RoomEnterUserData.builder()
                .memberId(member.getId())
                .roomId(room.getId())
                .resumeId(resume.getId())
                .roomParticipantId(roomParticipant.getId())
                .nickname(member.getNickname())
                .resumeUrl(resume.getFilePath())
                .build();
    }

    /**
     * RoomEnterUserData 객체를 JSON 문자열로 변환합니다.
     *
     * @return 객체의 JSON 표현
     * @throws CustomException 객체를 JSON으로 변환하는 데 실패한 경우 발생
     */
    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }

    /**
     * JSON 문자열을 RoomEnterUserData 객체로 변환합니다.
     *
     * @param json JSON 문자열
     * @return RoomEnterUserData 객체
     * @throws CustomException JSON 문자열을 객체로 변환하는 데 실패한 경우 발생
     */
    public static RoomEnterUserData fromJson(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(json, RoomEnterUserData.class);
        } catch (JsonProcessingException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }
}
