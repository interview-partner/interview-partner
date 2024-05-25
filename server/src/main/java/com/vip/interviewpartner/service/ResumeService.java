package com.vip.interviewpartner.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Resume;
import com.vip.interviewpartner.dto.ResumeLookupResponse;
import com.vip.interviewpartner.repository.ResumeRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ResumeService 클래스는 Resume 객체와 관련된 비즈니스 로직을 처리합니다.
 * 이 클래스는 ResumeRepository를 사용하여 데이터베이스와 상호 작용합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ResumeService {
    private final ResumeRepository resumeRepository;

    /**
     * 주어진 ID로 Resume 객체를 조회합니다.
     * 만약 해당 ID의 Resume 객체를 찾지 못하면 CustomException을 발생시킵니다.
     *
     * @param resumeId 조회할 Resume 객체의 ID
     * @return 조회된 Resume 객체
     * @throws CustomException 해당 ID의 Resume 객체를 찾지 못한 경우 발생
     */
    public Resume getResumeById(Long resumeId) {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST));
    }

    /**
     * 주어진 ID로 Resume 객체를 조회하고 소유권을 검증합니다.
     *
     * @param resumeId 조회할 Resume 객체의 ID
     * @param memberId 검증할 회원 ID
     * @return 조회 및 검증된 Resume 객체
     * @throws CustomException 해당 ID의 Resume 객체를 찾지 못하거나 소유권 검증에 실패한 경우 발생
     */
    public Resume getResumeByIdAndValidateOwnership(Long resumeId, Long memberId) {
        Resume resume = getResumeById(resumeId);
        validateResumeOwnership(resume, memberId);
        return resume;
    }

    /**
     * 주어진 회원 ID에 해당하는 활성 상태의 이력서 목록을 조회합니다.
     *
     * @param memberId 이력서를 조회할 회원의 ID
     * @return 주어진 회원 ID에 해당하는 활성 상태의 이력서 목록을 담은 ResumeLookupResponse 리스트
     */
    public List<ResumeLookupResponse> getResumesByMemberId(Long memberId) {
        List<Resume> resumes = resumeRepository.findByMemberIdAndIsActive(memberId, true);
        return resumes.stream()
                .map(ResumeLookupResponse::of)
                .toList();
    }

    /**
     * Resume 객체의 소유권을 검증합니다.
     *
     * @param resume   검증할 Resume 객체
     * @param memberId 검증할 회원 ID
     * @throws CustomException 소유권 검증에 실패한 경우 발생
     */
    private void validateResumeOwnership(Resume resume, Long memberId) {
        if (!resume.getMember().getId().equals(memberId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }

}
