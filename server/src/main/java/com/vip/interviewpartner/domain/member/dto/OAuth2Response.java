package com.vip.interviewpartner.domain.member.dto;

public interface OAuth2Response {
    //제공자 (Ex. naver, goole, ...)
    String getProvider();

    //제공자에서 발급해주는 아이디(번호)
    String getProviderId();

    //이메일
    String getEmail();

}
