package com.vip.interviewpartner.domain.question.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.common.util.JsonStringEscapeConverter;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 질문을 만들어주는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class QuestionCreateService {
    private final OkHttpClient httpClient = new OkHttpClient();

    @Value("${gpt.credentials.secretKey}")
    private String apiKey;

    /**
     * 추출된 이력서 텍스트 및 질문개수를 통해 질문을 만들어주는 매서드입니다.
     *
     * @param resumeTxt      S3에서 다운로드 받은 이력서 텍스트
     * @param questionNumber 사용자가 선택한 질문 개수
     * @return 각 질문을 String으로 받은 List
     */
    public List<String> make(String resumeTxt, int questionNumber) {
        String content = sendRequest(resumeTxt, questionNumber);
        List<String> contents = splitcontents(content);
        log.info("contents = {}", contents.toString());

        return contents;
    }

    /**
     * GPT API에게 질문 내용 생성을 요청하는 메서드 입니다.
     *
     * @param resumeTxt      추출된 이력서 텍스트
     * @param questionNumber 질문 개수
     * @return json 형태의 문자열 응답
     */
    public String sendRequest(String resumeTxt, int questionNumber) {
        String content = "";
        String prompt = "Here is the text from my resume:\n" + resumeTxt + "\n\nPlease provide " + questionNumber + " questions in JSON format (without code blocks). Each question should be in Korean and be a key-value pair, where the key is a string number and the value is the question string. The questions should cover a variety of topics including technical background, project experience, and reasons for technology stack choices. For example: { \"1\": \"Question 1\" }.";
        try {
            MediaType JSON = MediaType.get("application/json; charset=utf-8");

            // JSON 객체 구성
            JsonObject json = new JsonObject();
            json.addProperty("model", "gpt-3.5-turbo");

            JsonArray messages = new JsonArray();
            JsonObject message = new JsonObject();
            message.addProperty("role", "user");
            message.addProperty("content", prompt);
            messages.add(message);

            json.add("messages", messages);

            // JSON 문자열 생성
            String jsonString = json.toString();
            RequestBody body = RequestBody.create(jsonString, JSON);
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
     * GPT API에게 꼬리 질문 내용 생성을 요청을 보내는 메서드입니다.
     *
     * @param questionContent 전 질문 내용
     * @param answerContent   전 질문에 대한 답변 내용
     * @return 꼬리 질문 컨탠츠
     */
    public String tailQuestionRequest(String questionContent, String answerContent) {
        String content = "";
        StringBuilder questionAndAnswer = new StringBuilder();
        questionAndAnswer.append("Interviewer Question (Korean): ")
                .append(JsonStringEscapeConverter.convertToJsonString(questionContent))
                .append(" ");
        questionAndAnswer.append("Interviewee Answer (Korean): ")
                .append(JsonStringEscapeConverter.convertToJsonString(answerContent))
                .append(" ");
        questionAndAnswer.append(
                "This is a history of the previous conversation. You are the interviewer. Based on the previous conversation, please provide a concise follow-up question in Korean. The question must be concise and within 70 characters, and it should reference the answers provided by the interviewee. Here is an example: 'You mentioned you worked on a project using Java. What was the most challenging part of that project?");
        try {
            MediaType JSON = MediaType.get("application/json; charset=utf-8");
            String json = "{"
                    + "\"model\": \"gpt-3.5-turbo\","
                    + "\"messages\": [{\"role\": \"user\", \"content\": \"" + questionAndAnswer.toString() + "\"}]"
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
            System.out.println("e = " + e);
            throw new CustomException(ErrorCode.GPT_REQUEST_FAILURE);
        }
        return content;
    }

    /**
     * JSON 응답에서 질문들을 추출하여 리스트로 반환하는 메서드입니다.
     *
     * @param text JSON 응답 문자열
     * @return 질문 목록
     */
    public List<String> splitcontents(String text) {
        List<String> contents = new ArrayList<>();
        JsonObject jsonResponse = JsonParser.parseString(text).getAsJsonObject();

        for (String key : jsonResponse.keySet()) {
            contents.add(jsonResponse.get(key).getAsString());
        }
        return contents;
    }
}
