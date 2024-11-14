package com.vip.interviewpartner.domain.member.repository;

import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN_EXPIRATION_TIME;

import com.vip.interviewpartner.domain.member.dto.RefreshTokenData;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

/**
 * 리프레쉬 토큰을 관리하는 레포지토리 클래스입니다.
 * 이 클래스는 Redis를 사용하여 리프레쉬 토큰을 저장하고 관리합니다.
 */
@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository {

    private final RedisTemplate redisTemplate;

    /**
     * 리프레쉬 토큰을 저장하는 메소드입니다.
     * 이 메소드는 리프레쉬 토큰 데이터를 인자로 받아, 이를 Redis에 { key: refreshToken, value: memberId } 형태로 저장합니다.
     * 저장된 리프레쉬 토큰은 정해진 시간 후에 만료됩니다.
     *
     * @param refreshTokenData 저장할 리프레쉬 토큰 데이터
     */
    public void save(final RefreshTokenData refreshTokenData) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        valueOperations.set(refreshTokenData.getRefreshToken(), refreshTokenData.getMemberId());
        redisTemplate.expire(refreshTokenData.getRefreshToken(), REFRESH_TOKEN_EXPIRATION_TIME, TimeUnit.MILLISECONDS);
    }

    /**
     * 이 메소드는 주어진 refreshToken으로 Redis에서 memberId를 찾습니다.
     * memberId가 존재하면 RefreshTokenData 객체를 반환하고, 그렇지 않으면 빈 Optional 객체를 반환합니다.
     *
     * @param refreshToken 찾을 refreshToken
     * @return Optional<RefreshTokenData> memberId가 존재하면 RefreshTokenData 객체를 포함하는 Optional, 그렇지 않으면 빈 Optional
     */
    public Optional<RefreshTokenData> findByRefreshToken(final String refreshToken) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String memberId = valueOperations.get(refreshToken);

        if (Objects.isNull(memberId)) {
            return Optional.empty();
        }

        return Optional.of(new RefreshTokenData(refreshToken, memberId));
    }

    /**
     * 이 메소드는 주어진 refreshToken을 Redis에서 삭제합니다.
     *
     * @param refreshToken 삭제할 refreshToken
     */
    public void deleteByRefreshToken(final String refreshToken) {
        redisTemplate.delete(refreshToken);
    }

}
