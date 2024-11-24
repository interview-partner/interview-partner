package com.vip.interviewpartner.domain.feedback.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * FeedbackCountDTO 클래스는 피드백을 받은 참가자 ID와 받은 피드백 개수를 담는 DTO 입니다.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackCountDTO {
    private Long receiverId;
    private Long count;
}
