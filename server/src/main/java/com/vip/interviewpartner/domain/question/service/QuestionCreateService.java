package com.vip.interviewpartner.domain.question.service;

import com.vip.interviewpartner.common.exception.CustomException;
import com.vip.interviewpartner.common.exception.ErrorCode;
import com.vip.interviewpartner.domain.interview.entity.Interview;
import com.vip.interviewpartner.domain.question.dto.response.GptTailQuestionResponse;
import com.vip.interviewpartner.domain.question.entity.Question;
import com.vip.interviewpartner.domain.question.repository.QuestionRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 질문을 만들어주는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionCreateService {
    private static final String QUESTION_PROMPT_TEMPLATE =
            "Based on the provided resume text, Generate %d interview questions in Korean, where the key is the question number and the value is the question content"
                    + "Here is the text from my resume:\n%s\n\n"
                    + "Focus on technical background, project experience, " +
                    "and reasons for technology choices.";
    private static final String TAIL_QUESTION_PROMPT_TEMPLATE =
            "Interviewer Question (Korean): %s " + "Interviewee Answer (Korean): %s "
                    + "This is a history of the previous conversation. "
                    + "You are the interviewer. Based on the previous conversation, "
                    + "please provide a concise follow-up question in Korean. "
                    + "The follow-up question must specifically reference the interviewee's answer, "
                    + "and the question must start by directly mentioning the answer. "
                    + "For example: 'You mentioned you used Kafka as a Message Queue. "
                    + "What procedures did you establish to recover or reprocess data in case of a failure?'";
    private final QuestionRepository questionRepository;
    private final ChatClient chatClient;

    /**
     * 추출된 이력서 텍스트 및 질문개수를 통해 질문을 만들어주는 매서드입니다.
     *
     * @param resumeTxt      S3에서 다운로드 받은 이력서 텍스트
     * @param questionNumber 사용자가 선택한 질문 개수
     * @return 각 질문을 String으로 받은 List
     */
    @Transactional
    public List<Question> create(Interview interview, String resumeTxt, int questionNumber) {
        Map<String, String> response = chatClient.prompt()
                .advisors(new SimpleLoggerAdvisor())
                .user(String.format(QUESTION_PROMPT_TEMPLATE, questionNumber, resumeTxt))
                .call()
                .entity(new ParameterizedTypeReference<Map<String, String>>() {
                });
        if (response == null) {
            throw new CustomException(ErrorCode.GPT_REQUEST_FAILURE);
        }
        List<Question> questions = response.values().stream()
                .map(question -> Question.builder()
                        .interview(interview)
                        .content(question)
                        .build())
                .toList();
        questionRepository.saveAll(questions);
        return questions;
    }

    /**
     * 꼬리 질문을 생성하는 메서드입니다.
     *
     * @param parentQuestion 부모 질문
     * @param question       질문 내용
     * @param answer         답변 내용
     * @return
     */
    @Transactional
    public Question createTailQuestion(Question parentQuestion, String question, String answer) {
        GptTailQuestionResponse response = chatClient.prompt()
                .user(String.format(TAIL_QUESTION_PROMPT_TEMPLATE, question, answer))
                .call()
                .entity(GptTailQuestionResponse.class);

        Question tailQuestion = Question.builder()
                .interview(parentQuestion.getInterview())
                .content(response.question())
                .parent(parentQuestion)
                .build();

        questionRepository.save(tailQuestion);
        return tailQuestion;
    }
}
