package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.RoomCreateRequest;
import com.vip.interviewpartner.dto.RoomCreateResponse;
import com.vip.interviewpartner.service.RoomCreateService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "rooms", description = "모의면접 방 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final RoomCreateService roomCreateService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<RoomCreateResponse> createRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @Valid @RequestBody RoomCreateRequest roomCreateRequest) {
        RoomCreateResponse roomCreateResponse = roomCreateService.create(customUserDetails.getMemberId(), roomCreateRequest);
        return ApiCommonResponse.successResponse(roomCreateResponse);
    }

}
