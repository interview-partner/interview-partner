package com.vip.interviewpartner.config;

import com.vip.interviewpartner.common.jwt.LoginFilter;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.headers.Header;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

/**
 * SpringDoc OpenAPI 설정을 정의하는 클래스입니다.
 */
@Configuration
@RequiredArgsConstructor
public class SpringDocConfig {

    private final ApplicationContext applicationContext;

    /**
     * SpringDoc OpenAPI 스펙을 반환하는 Bean을 생성합니다.
     *
     * @return OpenAPI 객체
     */
    @Bean
    public OpenAPI openAPI() {
        final String securitySchemeName = "bearerAuth";

        Info info = new Info()
                .title("Interview Partner API Document")
                .version("v1.0.0")
                .description("Interview Partner API 명세서입니다.");
        OpenAPI openAPI = new OpenAPI()
                .addSecurityItem(new SecurityRequirement()
                        .addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .description("로그인 API를 호출해 받은 accessToken을 입력해주세요. refreshToken은 쿠키로 전달됩니다.")
                                .bearerFormat("JWT")))
                .info(info)
                .paths(new Paths());

        springSecurityLoginCustomizer().customise(openAPI);
        addOAuthEndpoints(openAPI);

        return openAPI;

    }

    /**
     * 로그인 필터에 대한 OpenAPI 명세를 추가하는 메소드입니다.
     * 이 메소드는 로그인 필터를 찾아, 이에 대한 OpenAPI 명세를 생성하고 추가합니다.
     *
     * @return OpenAPI 명세를 추가하는 OpenApiCustomizer
     */
    @Bean
    public OpenApiCustomizer springSecurityLoginCustomizer() {
        FilterChainProxy filterChainProxy = applicationContext.getBean(
                AbstractSecurityWebApplicationInitializer.DEFAULT_FILTER_NAME, FilterChainProxy.class);
        return openAPI -> {
            for (SecurityFilterChain filterChain : filterChainProxy.getFilterChains()) {
                Optional<LoginFilter> optionalFilter =
                        filterChain.getFilters().stream()
                                .filter(LoginFilter.class::isInstance)
                                .map(LoginFilter.class::cast)
                                .findAny();
                if (optionalFilter.isPresent()) {
                    Operation operation = new Operation();
                    Schema<?> schema = new ObjectSchema()
                            .addProperty("email", new StringSchema())
                            .addProperty("password", new StringSchema());

                    MediaType mediaType = new MediaType()
                            .schema(schema)
                            .example("{\"email\": \"user@example.com\", \"password\": \"yourpassword\"}");
                    RequestBody requestBody = new RequestBody().content(
                            new Content().addMediaType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE, mediaType));

                    operation.requestBody(requestBody);
                    ApiResponses apiResponses = new ApiResponses();
                    ApiResponse successResponse = new ApiResponse()
                            .description("로그인 성공 - 헤더에 'Authorization'로 엑세스 토큰이 포함되어 있으며, " +
                                    "'Set-Cookie' 헤더를 통해 리프레쉬 토큰이 쿠키로 설정됩니다.")
                            .addHeaderObject("Authorization", new Header().description("Bearer [access token]").schema(new StringSchema()))
                            .addHeaderObject("Set-Cookie", new Header().description("refreshToken=[token]; Path=/; HttpOnly"));
                    apiResponses.addApiResponse(String.valueOf(HttpStatus.OK.value()),
                            successResponse);
                    apiResponses.addApiResponse(String.valueOf(HttpStatus.BAD_REQUEST.value()),
                            new ApiResponse().description("유효한 형식이 아님"));
                    apiResponses.addApiResponse(String.valueOf(HttpStatus.UNAUTHORIZED.value()),
                            new ApiResponse().description("로그인 실패"));
                    operation.responses(apiResponses);
                    operation.addTagsItem("auth");
                    operation.description("로그인");
                    operation.setSecurity(List.of());
                    operation.summary("로그인 API");
                    PathItem pathItem = new PathItem().post(operation);
                    openAPI.getPaths().addPathItem("/api/v1/auth/login", pathItem);
                }
            }
        };
    }

    private void addOAuthEndpoints(OpenAPI openAPI) {
        addOAuthEndpoint(openAPI, "naver", "Naver OAuth2 로그인", "네이버 OAuth2 인증을 시작합니다.");
        addOAuthEndpoint(openAPI, "kakao", "Kakao OAuth2 로그인", "카카오 OAuth2 인증을 시작합니다.");
    }

    private void addOAuthEndpoint(OpenAPI openAPI, String provider, String summary, String description) {
        Paths paths = openAPI.getPaths();

        Operation operation = new Operation()
                .addTagsItem("auth")
                .summary(summary)
                .description(description)
                .security(List.of())
                .responses(createOAuthResponses());
        PathItem pathItem = new PathItem().get(operation);
        paths.addPathItem("/api/v1/auth/login/oauth2/" + provider, pathItem);
    }

    private ApiResponses createOAuthResponses() {
        ApiResponses responses = new ApiResponses();
        responses.addApiResponse(String.valueOf(HttpStatus.FOUND.value()),
                new ApiResponse().description("리다이렉션 성공, 리프레시 토큰이 쿠키에 저장되었습니다. 이 토큰을 사용하여 토큰 재발행 페이지로 리다이렉션을 해 엑세스토큰까지 받습니다."));
        responses.addApiResponse(String.valueOf(HttpStatus.BAD_REQUEST.value()),
                new ApiResponse().description("잘못된 요청"));
        return responses;
    }

}
