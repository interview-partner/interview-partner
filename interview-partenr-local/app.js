const express = require('express');
const bodyParser = require('body-parser');
const amqplib = require('amqplib');

const app = express();
app.use(bodyParser.json());

// RabbitMQ 설정
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME || 'admin';
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || 'admin1234';
const RABBITMQ_EXCHANGE = process.env.RABBITMQ_EXCHANGE || 'openvidu.events';
const RABBITMQ_VHOST = process.env.RABBITMQ_VHOST || 'openvidu';

// 라우팅 키 매핑
const ROUTING_KEY_MAPPING = {
    sessionDestroyed: 'event.room.sessionDestroyed',
    participantJoined: 'event.participant.participantJoined',
    participantLeft: 'event.participant.participantLeft',
    signalSent: 'event.chat.event',
};

// 웹훅 엔드포인트
app.post('/webhook', async (req, res) => {
    const { event, timestamp, data } = req.body;

    // 이벤트 유형 확인
    const routingKey = ROUTING_KEY_MAPPING[event];
    if (!routingKey) {
        return res.status(400).json({ error: `Invalid event type: ${event}` });
    }

    try {
        // RabbitMQ 연결 설정
        const connection = await amqplib.connect({
            protocol: 'amqp',
            hostname: RABBITMQ_HOST,
            port: RABBITMQ_PORT,
            username: RABBITMQ_USERNAME,
            password: RABBITMQ_PASSWORD,
            vhost: RABBITMQ_VHOST,
        });

        const channel = await connection.createChannel();
        await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });

        // 메시지 발행
        const messageBody = JSON.stringify(req.body);
        channel.publish(RABBITMQ_EXCHANGE, routingKey, Buffer.from(messageBody));

        await channel.close();
        await connection.close();

        return res.status(200).json({ status: 'success', event });
    } catch (err) {
        return res.status(500).json({ error: `Failed to send message: ${err.message}` });
    }
});

// 서버 시작
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});