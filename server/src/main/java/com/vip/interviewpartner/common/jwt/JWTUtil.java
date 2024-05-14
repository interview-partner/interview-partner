package com.vip.interviewpartner.common.jwt;

import static com.vip.interviewpartner.common.constants.Constants.ACCESS;
import static com.vip.interviewpartner.common.constants.Constants.ACCESS_TOKEN_EXPIRATION_TIME;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH;
import static com.vip.interviewpartner.common.constants.Constants.REFRESH_TOKEN_EXPIRATION_TIME;
import static com.vip.interviewpartner.common.exception.ErrorCode.ACCESS_TOKEN_EXPIRED;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_REQUEST;
import static com.vip.interviewpartner.common.exception.ErrorCode.INVALID_TOKEN;

import com.vip.interviewpartner.common.exception.CustomException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
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
     * 주어진 토큰이 유효성 검증을 합니다.
     * 토큰이 만료되었을 경우, ACCESS_TOKEN_EXPIRED 예외를 발생시킵니다.
     * 토큰이 유효하지 않거나 요청이 잘못된 경우, 각각 INVALID_TOKEN, INVALID_REQUEST 예외를 발생시킵니다.
     * 토큰 카테고리가 기대하는 카테고리와 일치하지 않는 경우, INVALID_REQUEST 예외를 발생시킵니다.
     *
     * @param token 검증할 JWT 토큰
     * @throws CustomException 토큰이 만료되었거나 유효하지 않은 경우, 잘못된 요청인 경우, 또는 카테고리가 다를 경우 발생합니다.
     */
    public void validateToken(String token, String expectedCategory) {
        try {
            parseToken(token);
        } catch (ExpiredJwtException e) {
            throw new CustomException(ACCESS_TOKEN_EXPIRED);
        } catch (JwtException e) {
            throw new CustomException(INVALID_TOKEN);
        } catch (Exception e) {
            throw new CustomException(INVALID_REQUEST);
        }
        validateTokenCategory(token, expectedCategory);
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

    /**
     * 주어진 JWT 토큰을 파싱합니다. 이 메소드는 JWT 토큰의 유효성을 검증하며, 토큰이 만료되었거나 유효하지 않은 경우 예외를 발생시킵니다.
     * 이 메소드는 내부적으로 Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token)를 호출하여 토큰을 파싱합니다.
     *
     * @param token 파싱할 JWT 토큰
     * @throws ExpiredJwtException 토큰이 만료된 경우
     * @throws JwtException 토큰이 유효하지 않은 경우
     */
    private void parseToken(String token) {
        Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
    }

    /**
     * 주어진 토큰의 카테고리를 검증합니다. 카테고리가 주어진 카테고리와 일치하지 않는 경우, INVALID_REQUEST 예외를 발생시킵니다.
     *
     * @param token            검증할 JWT 토큰
     * @param expectedCategory 기대하는 카테고리
     * @throws CustomException 카테고리가 기대하는 카테고리와 일치하지 않는 경우
     */
    private void validateTokenCategory(String token, String expectedCategory) {
        String category = getCategory(token);
        if (!category.equals(expectedCategory)) {
            throw new CustomException(INVALID_REQUEST);
        }
    }

}
