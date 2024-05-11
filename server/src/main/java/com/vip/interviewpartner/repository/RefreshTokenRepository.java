package com.vip.interviewpartner.repository;

import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN_EXPIRATION_TIME;

import com.vip.interviewpartner.dto.RefreshTokenData;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

/**
 * 리프레쉬 토큰을 관리하는 레포지토리 클래스입니다.
 * 이 클래스는 Redis를 사용하여 리프레쉬 토큰을 저장하고 관리합니다.
 */
@Repository
@RequiredArgsConstructor
@Slf4j
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

}
