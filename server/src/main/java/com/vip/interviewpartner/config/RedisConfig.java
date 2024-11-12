package com.vip.interviewpartner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * Redis 설정을 위한 클래스입니다.
 * 이 클래스는 Redis 연결과 템플릿을 설정합니다.
 */
@Configuration
public class RedisConfig {
    @Value("${spring.data.redis.host}")
    private String redisHost;
    @Value("${spring.data.redis.port}")
    private int redisPort;

    /**
     * Redis 연결 팩토리를 생성합니다.
     * 이 메소드는 RedisStandaloneConfiguration을 사용하여 Redis 연결을 설정하고, LettuceConnectionFactory를 사용하여 연결 팩토리를 생성합니다.
     *
     * @return 생성된 RedisConnectionFactory
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisHost);
        redisConfig.setPort(redisPort);
        return new LettuceConnectionFactory(redisConfig);
    }

    /**
     * Redis 템플릿을 생성합니다.
     * 이 메소드는 StringRedisTemplate을 사용하여 Redis 템플릿을 생성하고, 위에서 생성한 연결 팩토리를 설정합니다.
     *
     * @return 생성된 RedisTemplate
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate() {
        StringRedisTemplate redisTemplate = new StringRedisTemplate();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        return redisTemplate;
    }
}
