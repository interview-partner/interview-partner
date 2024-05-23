package com.vip.interviewpartner.controller;

import com.vip.interviewpartner.common.ApiCommonResponse;
import com.vip.interviewpartner.domain.RoomStatus;
import com.vip.interviewpartner.dto.CustomUserDetails;
import com.vip.interviewpartner.dto.RoomCreateRequest;
import com.vip.interviewpartner.dto.RoomCreateResponse;
import com.vip.interviewpartner.dto.RoomResponseDTO;
import com.vip.interviewpartner.service.RoomCreateService;
import com.vip.interviewpartner.service.RoomLookupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "rooms", description = "모의면접 방 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rooms")
@Slf4j
public class RoomController {

    private final RoomCreateService roomCreateService;
    private final RoomLookupService roomLookupService;

    @Operation(summary = "방 생성 API",
            description = "새로운 모의면접방을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "방 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "요청 형식에 맞지 않음", content = @Content),
                    @ApiResponse(responseCode = "404", description = "해당 리소스가 존재하지 않음(member, tag)", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Openvidu 서버에 문제가 생김", content = @Content),
            }
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCommonResponse<RoomCreateResponse> createRoom(@AuthenticationPrincipal CustomUserDetails customUserDetails, @Valid @RequestBody RoomCreateRequest roomCreateRequest) {
        RoomCreateResponse roomCreateResponse = roomCreateService.create(customUserDetails.getMemberId(), roomCreateRequest);
        return ApiCommonResponse.successResponse(roomCreateResponse);
    }

    @Operation(summary = "방 목록 조회 API",
            description = "모의면접방을 목록을 조회합니다. 최신순으로 정렬됩니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "방 목록 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "요청 형식에 맞지 않음", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버에러", content = @Content),
            }
    )
    @SecurityRequirements(value = {})
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiCommonResponse<List<RoomResponseDTO>> createRoom(@Parameter(description = "조회할 방의 상태(open OR closed)", required = true) @RequestParam(defaultValue = "open") String status,
                                                               @Parameter(description = "페이지 정보. 기본값: size=6, sort=createDate, direction=DESC") @PageableDefault(size = 6, sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable) {
        RoomStatus roomStatus = RoomStatus.fromString(status);
        List<RoomResponseDTO> rooms = roomLookupService.getRoomsByStatus(roomStatus, pageable);
        return ApiCommonResponse.successResponse(rooms);
    }

}
