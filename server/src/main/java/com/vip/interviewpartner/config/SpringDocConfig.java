package com.vip.interviewpartner.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc OpenAPI 설정을 정의하는 클래스입니다.
 */
@Configuration
public class SpringDocConfig {

    /**
     * SpringDoc OpenAPI 스펙을 반환하는 Bean을 생성합니다.
     *
     * @return OpenAPI 객체
     */
    @Bean
    public OpenAPI openAPI() {
        Info info = new Info()
                .title("Interview Partner API Document")
                .version("v1.0.0")
                .description("Interview Partner API 명세서입니다.");
        return new OpenAPI()
                .components(new Components())
                .info(info);
    }
}
