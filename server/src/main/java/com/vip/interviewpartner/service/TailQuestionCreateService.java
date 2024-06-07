package com.vip.interviewpartner.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.Interview;
import com.vip.interviewpartner.domain.Question;
import com.vip.interviewpartner.dto.TailQuestionResponse;
import com.vip.interviewpartner.repository.InterviewRepository;
import com.vip.interviewpartner.repository.QuestionRepository;
import com.vip.interviewpartner.repository.UserAnswerRepository;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 꼬리 질문을 생성하는 서비스 클래스 입니다.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TailQuestionCreateService {
    private final OkHttpClient httpClient = new OkHttpClient();

    @Value("${gpt.credentials.secretKey}")
    private String apiKey;

    private final QuestionRepository questionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final InterviewRepository interviewRepository;

    /**
     * 꼬리 질문을 생성하는 메서드 입니다.
     *
     * @param questionId 전 질문의 ID
     * @return 꼬리 질문 내용 content
     */
    @Transactional
    public TailQuestionResponse createTailQuestion(Long questionId){
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        Interview interview = interviewRepository.findByQuestionId(questionId);
        String answerContent = userAnswerRepository.findContentByQuestionId(questionId);

        String tailQuestionContent = sendRequest(question.getContent(), answerContent);

        Question tailQuestion = new Question(interview, tailQuestionContent, question);
        questionRepository.save(tailQuestion);

        return new TailQuestionResponse(tailQuestionContent);
    }

    /**
     * GPT API를 요청하는 메서드입니다.
     *
     * @param questionContent 전 질문 내용
     * @param answerContent 전 질문에 대한 답변 내용
     * @return 꼬리 질문 컨탠츠
     */
    public String sendRequest(String questionContent, String answerContent) {
        String content = "";
        questionContent += "\\n"+ answerContent + "\\n" + "다음 질문과 답변을 보고 추가적으로 질문을 하나만 더 해줘" + "\\n" + "답변형식은 질문으로만";
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
            throw new CustomException(ErrorCode.GPT_REQUEST_FAILURE);
        }
        return content;
    }

}
