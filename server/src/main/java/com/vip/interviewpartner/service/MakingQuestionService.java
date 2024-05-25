package com.vip.interviewpartner.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Question;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 질문을 만들어주는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MakingQuestionService {
    private final OkHttpClient httpClient = new OkHttpClient();

    @Value("${gpt.credentials.secretKey}")
    private String apiKey;

    /**
     * 추출된 이력서 텍스트 및 질문개수를 통해 질문을 만들어주는 매서드입니다.
     *
     * @param resume_txt S3에서 다운로드 받은 이력서 텍스트
     * @param question_number 사용자가 선택한 질문 개수
     * @return 각 질문을 String으로 받은 List
     */
    public List<String> make(String resume_txt, int question_number){
        String content = sendRequest(resume_txt, question_number);
        List<String> contents = splitcontents(content);

        return contents;
    }

    /**
     * GPT API를 통해 요청을 보내는 매서드 입니다.
     *
     * @param resume_txt 추출된 이력서 텍스트
     * @param question_number 질문 개수
     * @return json 형태의 문자열 응답
     */
    public String sendRequest(String resume_txt, int question_number) {
        String content = "";
        resume_txt += "\\n 질문" + question_number + "개 생성" ;
        try {
            MediaType JSON = MediaType.get("application/json; charset=utf-8");
            String json = "{"
                    + "\"model\": \"gpt-3.5-turbo\","
                    + "\"messages\": [{\"role\": \"user\", \"content\": \"" + resume_txt + "\"}]"
                    + "}";
            RequestBody body = RequestBody.create(json, JSON);
            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/chat/completions")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body().string();

                // JSON 응답에서 content 필드만 추출하여 출력
                JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();
                content = jsonResponse.getAsJsonArray("choices").get(0).getAsJsonObject().get("message").getAsJsonObject().get("content").getAsString();


            }
        } catch (Exception e) {
            throw new CustomException(ErrorCode.GPT_REQUEST_FAILURE);
        }
        return content;
    }

    /**
     * json에서 contents 부분만 추출하는 매서드
     * 정규 표현식을 이용하여 파싱함.
     *
     * @param text 문자열 형태의 json
     * @return 파싱된 질문 목록들
     */
    public ArrayList<String> splitcontents(String text) {
        ArrayList<String> contents = new ArrayList<>();
        String[] items = text.split("\\n");
        Pattern pattern = Pattern.compile("\\d+\\.\\s");

        for (String item : items) {
            Matcher matcher = pattern.matcher(item);
            if (matcher.find()) {
                contents.add(item.substring(matcher.end()).trim());
            }
        }


        return contents;
    }
}
