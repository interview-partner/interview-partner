package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.service.WebhookService;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Hidden
@RestController
@RequiredArgsConstructor
@RequestMapping("/webhook")
public class WebhookController {

    private final WebhookService webhookService;

    /**
     * 웹훅 요청을 처리합니다.
     *
     * @param payload 웹훅 요청의 페이로드
     * @param authHeader 인증 헤더
     * @return HTTP 상태 코드
     */
    @PostMapping
    public ResponseEntity<Void> handleWebhook(@RequestBody Map<String, Object> payload, @RequestHeader("Authorization") String authHeader) {
        if (!webhookService.isValidAuthHeader(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        webhookService.handleWebhookEvent(payload);
        return ResponseEntity.ok().build();
    }
}

