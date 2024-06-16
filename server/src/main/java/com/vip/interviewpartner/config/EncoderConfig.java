package com.vip.interviewpartner.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 암호화 관련 설정을 정의하는 클래스입니다.
 */
@Configuration
public class EncoderConfig {

    /**
     * BCryptPasswordEncoder 빈을 생성합니다.
     *
     * @return BCryptPasswordEncoder 객체
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
