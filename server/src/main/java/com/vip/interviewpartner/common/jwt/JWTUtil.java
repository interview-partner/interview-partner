package com.vip.interviewpartner.common.jwt;

import static com.vip.interviewpartner.common.constants.Constants.ACCESS;
import static com.vip.interviewpartner.common.constants.Constants.ACCESS_TOKEN_EXPIRATION_TIME;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN_EXPIRATION_TIME;

import io.jsonwebtoken.Jwts;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * JWT 토큰을 생성하고 검증하는 유틸리티 클래스입니다.
 * 이 클래스는 JWT 토큰의 생성, 파싱, 검증 등의 기능을 제공합니다.
 */
@Component
public class JWTUtil {
    private final String CATEGORY = "category";
    private final String ID = "id";
    private final String NICKNAME = "nickname";
    private final String ROLE = "role";

    private SecretKey secretKey;

    /**
     * JWTUtil 생성자입니다. 애플리케이션의 설정에서 JWT 시크릿 키를 읽어와 SecretKey를 생성합니다.
     *
     * @param secret JWT 시크릿 키
     */
    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public Long getId(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get(ID, Long.class);
    }

    public String getNickname(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get(NICKNAME, String.class);
    }

    public String getRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get(ROLE, String.class);
    }

    public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get(CATEGORY, String.class);
    }

    /**
     * JWT 토큰의 만료 여부를 확인합니다.
     *
     * @param token JWT 토큰
     * @return 토큰이 만료되었으면 true, 그렇지 않으면 false
     */
    public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    /**
     * 엑세스 토큰을 생성합니다.
     *
     * @param id       사용자 ID
     * @param nickname 사용자 닉네임
     * @param role     사용자 역할
     * @return 생성된 엑세스 토큰
     */
    public String createAccessToken(Long id, String nickname, String role) {
        return Jwts.builder()
                .claim(CATEGORY, ACCESS)
                .claim(ID, id)
                .claim(NICKNAME, nickname)
                .claim(ROLE, role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

    /**
     * 리프레시 토큰을 생성합니다.
     *
     * @param id       사용자 ID
     * @param nickname 사용자 닉네임
     * @param role     사용자 역할
     * @return 생성된 리프레시 토큰
     */
    public String createRefreshToken(Long id, String nickname, String role) {
        return Jwts.builder()
                .claim(CATEGORY, REFRESH)
                .claim(ID, id)
                .claim(NICKNAME, nickname)
                .claim(ROLE, role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

}
