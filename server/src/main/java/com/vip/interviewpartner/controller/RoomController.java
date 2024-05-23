package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.RoomCreateRequest;
import com.vip.interviewpartner.dto.RoomCreateResponse;
import com.vip.interviewpartner.service.RoomCreateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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

    @Operation(summary = "방 생성 API",
            description = "새로운 모의면접방을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "방 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "요청 형식에 맞지 않음", content = @Content),
                    @ApiResponse(responseCode = "404", description = "해당 리소스가 존재하지 않음(member, tag)", content = @Content),
            }
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<RoomCreateResponse> createRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @Valid @RequestBody RoomCreateRequest roomCreateRequest) {
        RoomCreateResponse roomCreateResponse = roomCreateService.create(customUserDetails.getMemberId(), roomCreateRequest);
        return ApiCommonResponse.successResponse(roomCreateResponse);
    }

}
