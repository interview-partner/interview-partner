CREATE TABLE feedback
(
    id                      BIGINT AUTO_INCREMENT NOT NULL,
    update_date             datetime              NULL,
    create_date             datetime              NULL,
    sender_participant_id   BIGINT                NULL,
    receiver_participant_id BIGINT                NULL,
    content                 TEXT                  NULL,
    CONSTRAINT pk_feedback PRIMARY KEY (id)
);

CREATE TABLE interview
(
    id                BIGINT AUTO_INCREMENT NOT NULL,
    update_date       datetime              NULL,
    create_date       datetime              NULL,
    member_id         BIGINT                NULL,
    resume_id         BIGINT                NULL,
    title             VARCHAR(255)          NULL,
    job_advertisement TEXT                  NULL,
    interview_type    VARCHAR(255)          NULL,
    CONSTRAINT pk_interview PRIMARY KEY (id)
);

CREATE TABLE member
(
    id          BIGINT AUTO_INCREMENT NOT NULL,
    update_date datetime              NULL,
    create_date datetime              NULL,
    email       VARCHAR(100)          NOT NULL,
    password    VARCHAR(255)          NULL,
    nickname    VARCHAR(255)          NOT NULL,
    provider    VARCHAR(255)          NULL,
    provider_id VARCHAR(255)          NULL,
    is_active   TINYINT(1)            NOT NULL,
    `role`      VARCHAR(255)          NOT NULL,
    CONSTRAINT pk_member PRIMARY KEY (id)
);

CREATE TABLE message
(
    id                  INT AUTO_INCREMENT NOT NULL,
    room_participant_id BIGINT             NULL,
    content             VARCHAR(255)       NULL,
    create_date         datetime           NULL,
    CONSTRAINT pk_message PRIMARY KEY (id)
);

CREATE TABLE question
(
    id           BIGINT AUTO_INCREMENT NOT NULL,
    create_date  datetime              NULL,
    parent_id    BIGINT                NULL,
    interview_id BIGINT                NULL,
    content      VARCHAR(255)          NULL,
    model_answer VARCHAR(255)          NULL,
    CONSTRAINT pk_question PRIMARY KEY (id)
);

CREATE TABLE resume
(
    id                   BIGINT AUTO_INCREMENT NOT NULL,
    update_date          datetime              NULL,
    create_date          datetime              NULL,
    member_id            BIGINT                NULL,
    original_file_name   VARCHAR(255)          NULL,
    stored_file_name     VARCHAR(255)          NULL,
    file_path            VARCHAR(255)          NULL,
    translated_file_path VARCHAR(255)          NULL,
    is_active            TINYINT(1)            NOT NULL,
    CONSTRAINT pk_resume PRIMARY KEY (id)
);

CREATE TABLE room
(
    id               BIGINT AUTO_INCREMENT NOT NULL,
    update_date      datetime              NULL,
    create_date      datetime              NULL,
    owner_id         BIGINT                NULL,
    title            VARCHAR(255)          NULL,
    details          VARCHAR(255)          NULL,
    max_participants INT                   NULL,
    session_id       VARCHAR(255)          NULL,
    status           VARCHAR(255)          NOT NULL,
    CONSTRAINT pk_room PRIMARY KEY (id)
);

CREATE TABLE room_participant
(
    id          BIGINT AUTO_INCREMENT NOT NULL,
    update_date datetime              NULL,
    create_date datetime              NULL,
    room_id     BIGINT                NULL,
    member_id   BIGINT                NULL,
    resume_id   BIGINT                NULL,
    join_date   datetime              NULL,
    leave_date  datetime              NULL,
    CONSTRAINT pk_roomparticipant PRIMARY KEY (id)
);

CREATE TABLE room_tag
(
    id      INT AUTO_INCREMENT NOT NULL,
    room_id BIGINT             NULL,
    tag_id  INT                NULL,
    CONSTRAINT pk_room_tag PRIMARY KEY (id)
);

CREATE TABLE tag
(
    id          INT AUTO_INCREMENT NOT NULL,
    name        VARCHAR(255)       NOT NULL,
    usage_count INT                NOT NULL,
    CONSTRAINT pk_tag PRIMARY KEY (id)
);

CREATE TABLE user_answer
(
    id          BIGINT AUTO_INCREMENT NOT NULL,
    create_date datetime              NULL,
    question_id BIGINT                NULL,
    content     VARCHAR(255)          NULL,
    audio_path  VARCHAR(255)          NULL,
    CONSTRAINT pk_useranswer PRIMARY KEY (id)
);

ALTER TABLE member
    ADD CONSTRAINT UK_EMAIL UNIQUE (email);

ALTER TABLE member
    ADD CONSTRAINT UK_NICKNAME UNIQUE (nickname);

ALTER TABLE room_tag
    ADD CONSTRAINT UK_ROOM_TAG UNIQUE (room_id, tag_id);

ALTER TABLE tag
    ADD CONSTRAINT uc_tag_name UNIQUE (name);

ALTER TABLE feedback
    ADD CONSTRAINT FK_FEEDBACK_ON_RECEIVER_PARTICIPANT FOREIGN KEY (receiver_participant_id) REFERENCES room_participant (id);

ALTER TABLE feedback
    ADD CONSTRAINT FK_FEEDBACK_ON_SENDER_PARTICIPANT FOREIGN KEY (sender_participant_id) REFERENCES room_participant (id);

ALTER TABLE interview
    ADD CONSTRAINT FK_INTERVIEW_ON_MEMBER FOREIGN KEY (member_id) REFERENCES member (id);

ALTER TABLE interview
    ADD CONSTRAINT FK_INTERVIEW_ON_RESUME FOREIGN KEY (resume_id) REFERENCES resume (id);

ALTER TABLE message
    ADD CONSTRAINT FK_MESSAGE_ON_ROOM_PARTICIPANT FOREIGN KEY (room_participant_id) REFERENCES room_participant (id);

ALTER TABLE question
    ADD CONSTRAINT FK_QUESTION_ON_INTERVIEW FOREIGN KEY (interview_id) REFERENCES interview (id);

ALTER TABLE question
    ADD CONSTRAINT FK_QUESTION_ON_PARENT FOREIGN KEY (parent_id) REFERENCES question (id);

ALTER TABLE resume
    ADD CONSTRAINT FK_RESUME_ON_MEMBER FOREIGN KEY (member_id) REFERENCES member (id);

ALTER TABLE room_participant
    ADD CONSTRAINT FK_ROOMPARTICIPANT_ON_MEMBER FOREIGN KEY (member_id) REFERENCES member (id);

ALTER TABLE room_participant
    ADD CONSTRAINT FK_ROOMPARTICIPANT_ON_RESUME FOREIGN KEY (resume_id) REFERENCES resume (id);

ALTER TABLE room_participant
    ADD CONSTRAINT FK_ROOMPARTICIPANT_ON_ROOM FOREIGN KEY (room_id) REFERENCES room (id);

ALTER TABLE room
    ADD CONSTRAINT FK_ROOM_ON_OWNER FOREIGN KEY (owner_id) REFERENCES member (id);

ALTER TABLE room_tag
    ADD CONSTRAINT FK_ROOM_TAG_ON_ROOM FOREIGN KEY (room_id) REFERENCES room (id);

ALTER TABLE room_tag
    ADD CONSTRAINT FK_ROOM_TAG_ON_TAG FOREIGN KEY (tag_id) REFERENCES tag (id);

ALTER TABLE user_answer
    ADD CONSTRAINT FK_USERANSWER_ON_QUESTION FOREIGN KEY (question_id) REFERENCES question (id);
