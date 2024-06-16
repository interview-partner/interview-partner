package com.vip.interviewpartner.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
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
        resumeTxt += "\\n 질문" + questionNumber + "개 생성";
        try {
            MediaType JSON = MediaType.get("application/json; charset=utf-8");
            String json = "{"
                    + "\"model\": \"gpt-3.5-turbo\","
                    + "\"messages\": [{\"role\": \"user\", \"content\": \"" + resumeTxt + "\"}]"
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
     * GPT API에게 꼬리 질문 내용 생성을 요청을 보내는 메서드입니다.
     *
     * @param questionContent 전 질문 내용
     * @param answerContent   전 질문에 대한 답변 내용
     * @return 꼬리 질문 컨탠츠
     */
    public String tailQuestionRequest(String questionContent, String answerContent) {
        String content = "";
        questionContent += "\\n" + answerContent + "\\n" +
                "주어진 질문과 답변을 보고 추가적인 꼬리 질문을 하나만 더 해줘." + "\\n" +
                "당신은 지금부터 면접관의 역할을 맡게 됩니다." + "\\n" +
                "모든 질문은 면접관이 하는 것처럼 해야 합니다." + "\\n" +
                "질문은 지원자의 이해도를 평가하고, 추가 정보를 이끌어낼 수 있도록 구성되어야 합니다." + "\\n" +
                "질문은 1~2문장으로 간결하게 해야 합니다." + "\\n" +
                "질문은 한국어로 해야 하며, 70자를 넘지 않도록 해주세요." + "\\n" +
                "지원자의 배경 지식과 논리적 사고를 테스트하는 질문이어야 합니다." + "\\n" +
                "#예시: GET과 POST 간의 차이점에 대해 말해 보세요., 해당 프로젝트에서 어떤 역할을 맡으셨나요?, 해당 기술을 선택한 이유는 무엇인가요?, 프로젝트에서 직면한 주요 문제는 무엇이었나요?";
        try {
            MediaType JSON = MediaType.get("application/json; charset=utf-8");
            String json = "{"
                    + "\"model\": \"gpt-3.5-turbo\","
                    + "\"messages\": [{\"role\": \"user\", \"content\": \"" + questionContent + "\"}]"
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
     * json에서 contents 부분만 추출하는 매서드 정규 표현식을 이용하여 파싱함.
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
