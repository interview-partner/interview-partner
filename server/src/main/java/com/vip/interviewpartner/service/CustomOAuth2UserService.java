package com.vip.interviewpartner.service;

import static com.vip.interviewpartner.common.constants.Constants.KAKAO;
import static com.vip.interviewpartner.common.constants.Constants.NAVER;
import static com.vip.interviewpartner.common.exception.ErrorCode.DUPLICATE_EMAIL;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_REQUEST;
import static com.vip.interviewpartner.common.exception.ErrorCode.UNSUPPORTED_SOCIAL_MEDIA;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.domain.Member;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.KakaoResponse;
import com.vip.interviewpartner.dto.NaverResponse;
import com.vip.interviewpartner.dto.OAuth2Response;
import com.vip.interviewpartner.repository.MemberRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CustomOAuth2UserService는 OAuth2 소셜 로그인을 처리하는 서비스입니다.
 * 사용자 정보를 가져와서 데이터베이스에 저장하거나 기존 사용자를 반환합니다.
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    /**
     * OAuth2 소셜 로그인 요청을 처리하여 사용자 정보를 로드합니다.
     *
     * @param userRequest OAuth2UserRequest 객체로, OAuth2 클라이언트 정보를 포함합니다.
     * @return OAuth2User 객체로, 인증된 사용자 정보를 포함합니다.
     * @throws OAuth2AuthenticationException OAuth2 인증 실패 시 발생합니다.
     */
    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        try {
            if (registrationId == null) {
                throw new CustomException(INVALID_REQUEST);
            }
            OAuth2Response oAuth2Response;
            switch (registrationId) {
                case NAVER:
                    oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
                    break;
                case KAKAO:
                    oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
                    break;
                default:
                    throw new CustomException(UNSUPPORTED_SOCIAL_MEDIA);
            }
            Member member = findOrCreateMember(oAuth2Response);
            return new CustomUserDetails(member, oAuth2User.getAttributes());
        } catch (CustomException e) {
            throw new OAuth2AuthenticationException(new OAuth2Error(e.getErrorCode().name()), e.getMessage(), e);
        }
    }

    /**
     * OAuth2 응답을 기반으로 새로운 회원을 생성하거나 기존 회원을 반환합니다.
     *
     * @param oAuth2Response OAuth2Response 객체로, 소셜 로그인 응답 정보를 포함합니다.
     * @return Member 객체로, 새로 생성되었거나 기존에 존재하는 회원을 반환합니다.
     */
    @Transactional
    public Member findOrCreateMember(OAuth2Response oAuth2Response) {
        Optional<Member> optionalMember = memberRepository.findByProviderAndProviderId(oAuth2Response.getProvider(), oAuth2Response.getProviderId());

        if (optionalMember.isPresent()) {
            log.info("기존에 소셜로그인을 한 경우: {}", oAuth2Response.getProvider());
            return optionalMember.get();
        } else {
            return registerNewMember(oAuth2Response);
        }
    }

    /**
     * 새로운 회원을 등록합니다.
     *
     * @param oAuth2Response OAuth2Response 객체로, 소셜 로그인 응답 정보를 포함합니다.
     * @return Member 객체로, 새로 생성된 회원을 반환합니다.
     * @throws CustomException 동일한 소셜 계정으로 가입된 회원이 이미 존재하는 경우
     */
    private Member registerNewMember(OAuth2Response oAuth2Response) {
        log.info("소셜로그인으로 처음 로그인(강제 회원가입): {}", oAuth2Response.getProvider());
        if (memberRepository.existsByEmail(oAuth2Response.getEmail())) {
            throw new CustomException(DUPLICATE_EMAIL);
        }
        Member newMember = Member.builder()
                .email(oAuth2Response.getEmail())
                .nickname(createUniqueNickname())
                .provider(oAuth2Response.getProvider())
                .providerId(oAuth2Response.getProviderId())
                .build();
        memberRepository.save(newMember);
        return newMember;
    }

    /**
     * 고유한 닉네임을 생성합니다. 닉네임은 'user_' 접두사와 7자리의 랜덤 문자열로 총 12자리로 구성됩니다. 닉네임이 이미 존재하면 고유한 닉네임이 생성될 때까지 반복합니다.
     *
     * @return 고유한 닉네임 문자열
     */
    public String createUniqueNickname() {
        String nickname;
        do {
            String uniqueId = UUID.randomUUID().toString().replace("-", "").substring(0, 7);
            nickname = "user_" + uniqueId;
        } while (memberRepository.existsByNickname(nickname));
        return nickname;
    }
}
