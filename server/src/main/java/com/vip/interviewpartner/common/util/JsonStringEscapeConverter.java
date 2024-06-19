package com.vip.interviewpartner.common.util;

public class JsonStringEscapeConverter {
    /**
     * 문자열을 JSON 형식에 맞게 이스케이프합니다.
     *
     * @param str 이스케이프할 문자열
     * @return JSON 형식에 맞게 이스케이프된 문자열
     */
    public static String convertToJsonString(String str) {
        return str.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t")
                .replace("/", "\\/");
    }
}
