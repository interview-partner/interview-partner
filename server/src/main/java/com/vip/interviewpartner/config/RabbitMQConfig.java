package com.vip.interviewpartner.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.retry.MessageRecoverer;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.backoff.FixedBackOffPolicy;
import org.springframework.retry.interceptor.RetryOperationsInterceptor;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

@Configuration
public class RabbitMQConfig {

    /**
     * 재시도 정책을 정의합니다. 여기서는 고정 백오프(Fixed BackOff)를 사용하여 1초마다 최대 3번 재시도합니다.
     */
    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();

        FixedBackOffPolicy backOffPolicy = new FixedBackOffPolicy();
        backOffPolicy.setBackOffPeriod(2000); // 1초 대기
        retryTemplate.setBackOffPolicy(backOffPolicy);

        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);

        return retryTemplate;
    }

    /**
     * Message Recoverer 설정 (재시도 실패 시 DLQ로 전송)
     */
    @Bean
    public MessageRecoverer messageRecoverer() {
        // 기본적으로 reject and don't requeue, DLX가 처리
        return new RejectAndDontRequeueRecoverer();
    }

    /**
     * Retry Interceptor 설정, 리스너에 재시도 로직을 적용하기 위한 인터셉터입니다.
     */
    @Bean
    public RetryOperationsInterceptor retryInterceptor(RetryTemplate retryTemplate, MessageRecoverer messageRecoverer) {
        return RetryInterceptorBuilder.stateless()
                .retryOperations(retryTemplate)
                .recoverer(messageRecoverer)
                .build();
    }

    /**
     * RabbitListenerContainerFactory 설정, 리스너 컨테이너 팩토리를 설정하여 메시지 컨버터와 리트라이 인터셉터를 적용
     */
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory,
                                                                               RetryOperationsInterceptor retryInterceptor) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setAdviceChain(retryInterceptor);
        return factory;
    }

    // Exchange 선언
    @Bean
    public TopicExchange eventsExchange() {
        return new TopicExchange("openvidu.events", true, false);
    }

    // DLX(Dead Letter Exchange) 선언
    @Bean
    public TopicExchange dlxExchange() {
        return new TopicExchange("openvidu.dlx", true, false);
    }

    // 메인 Queue 선언 및 DLX 설정
    @Bean
    public Queue chatEventsQueue() {
        return QueueBuilder.durable("openvidu.chat.events.queue")
                .withArgument("x-dead-letter-exchange", "openvidu.dlx") // DLX 설정
                .withArgument("x-dead-letter-routing-key", "openvidu.chat.events.dlq") // DLQ 라우팅 키 설정
                .build();
    }

    @Bean
    public Queue participantEventsQueue() {
        return QueueBuilder.durable("openvidu.participant.events.queue")
                .withArgument("x-dead-letter-exchange", "openvidu.dlx")
                .withArgument("x-dead-letter-routing-key", "openvidu.participant.events.dlq")
                .build();
    }

    @Bean
    public Queue roomEventsQueue() {
        return QueueBuilder.durable("openvidu.room.events.queue")
                .withArgument("x-dead-letter-exchange", "openvidu.dlx")
                .withArgument("x-dead-letter-routing-key", "openvidu.room.events.dlq")
                .build();
    }

    // DLQ Queue 선언
    @Bean
    public Queue chatEventsDlqQueue() {
        return QueueBuilder.durable("openvidu.chat.events.dlq").build();
    }

    @Bean
    public Queue participantEventsDlqQueue() {
        return QueueBuilder.durable("openvidu.participant.events.dlq").build();
    }

    @Bean
    public Queue roomEventsDlqQueue() {
        return QueueBuilder.durable("openvidu.room.events.dlq").build();
    }

    // Binding 설정
    @Bean
    public Binding chatEventsBinding(TopicExchange eventsExchange, Queue chatEventsQueue) {
        return BindingBuilder.bind(chatEventsQueue).to(eventsExchange).with("event.chat.*");
    }

    @Bean
    public Binding participantEventsBinding(TopicExchange eventsExchange, Queue participantEventsQueue) {
        return BindingBuilder.bind(participantEventsQueue).to(eventsExchange).with("event.participant.*");
    }

    @Bean
    public Binding roomEventsBinding(TopicExchange eventsExchange, Queue roomEventsQueue) {
        return BindingBuilder.bind(roomEventsQueue).to(eventsExchange).with("event.room.*");
    }

    // DLQ Queue와 DLX Exchange 바인딩
    @Bean
    public Binding chatEventsDlqBinding(TopicExchange dlxExchange, Queue chatEventsDlqQueue) {
        return BindingBuilder.bind(chatEventsDlqQueue).to(dlxExchange).with("openvidu.chat.events.dlq");
    }

    @Bean
    public Binding participantEventsDlqBinding(TopicExchange dlxExchange, Queue participantEventsDlqQueue) {
        return BindingBuilder.bind(participantEventsDlqQueue).to(dlxExchange).with("openvidu.participant.events.dlq");
    }

    @Bean
    public Binding roomEventsDlqBinding(TopicExchange dlxExchange, Queue roomEventsDlqQueue) {
        return BindingBuilder.bind(roomEventsDlqQueue).to(dlxExchange).with("openvidu.room.events.dlq");
    }
}
