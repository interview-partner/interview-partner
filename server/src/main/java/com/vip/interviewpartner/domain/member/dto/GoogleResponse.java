package com.vip.interviewpartner.domain.member.dto;

import static com.vip.interviewpartner.common.constants.Constants.GOOGLE;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@ToString
public class GoogleResponse implements OAuth2Response {
    private final Map<String, Object> attribute;

    @Override
    public String getProvider() {
        return GOOGLE;
    }

    @Override
    public String getProviderId() {
        return (String) attribute.get("sub");
    }

    @Override
    public String getEmail() {
        return (String) attribute.get("email");
    }

}
