CREATE TABLE `tag`
(
    `id`          int                                     NOT NULL AUTO_INCREMENT,
    `name`        varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `usage_count` int                                     NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `member`
(
    `id`          bigint                                  NOT NULL AUTO_INCREMENT,
    `email`       varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
    `password`    varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `nickname`    varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `provider`    varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `provider_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `is_active`   tinyint(1) NOT NULL DEFAULT '1',
    `role`        varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `create_date` datetime(6) NOT NULL,
    `update_date` datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_EMAIL` (`email`),
    UNIQUE KEY `UK_NICKNAME` (`nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `resume`
(
    `id`                   bigint                                  NOT NULL AUTO_INCREMENT,
    `member_id`            bigint                                  NOT NULL,
    `original_file_name`   varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `stored_file_name`     varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `file_path`            varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `translated_file_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `is_active`            tinyint(1) NOT NULL DEFAULT '1',
    `create_date`          datetime(6) NOT NULL,
    `update_date`          datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY                    `idx_resume_member_id` (`member_id`),
    CONSTRAINT `fk_resume_member` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `interview`
(
    `id`                bigint                                  NOT NULL AUTO_INCREMENT,
    `member_id`         bigint                                  NOT NULL,
    `resume_id`         bigint                                  NOT NULL,
    `title`             varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `job_advertisement` text COLLATE utf8mb4_general_ci,
    `interview_type`    varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `create_date`       datetime(6) NOT NULL,
    `update_date`       datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY                 `idx_interview_resume_id` (`resume_id`),
    KEY                 `idx_interview_member_id` (`member_id`),
    CONSTRAINT `fk_interview_resume` FOREIGN KEY (`resume_id`) REFERENCES `resume` (`id`),
    CONSTRAINT `fk_interview_member` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `room`
(
    `id`               bigint                                  NOT NULL AUTO_INCREMENT,
    `owner_id`         bigint                                  NOT NULL,
    `title`            varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `details`          varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `max_participants` int                                     NOT NULL,
    `session_id`       varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `status`           varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `create_date`      datetime(6) NOT NULL,
    `update_date`      datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY                `idx_room_owner_id` (`owner_id`),
    CONSTRAINT `fk_room_owner` FOREIGN KEY (`owner_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `room_tag`
(
    `id`      int    NOT NULL AUTO_INCREMENT,
    `room_id` bigint NOT NULL,
    `tag_id`  int    NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_room_tag` (`room_id`,`tag_id`),
    KEY       `idx_room_tag_tag_id` (`tag_id`),
    CONSTRAINT `fk_room_tag_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
    CONSTRAINT `fk_room_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `room_participant`
(
    `id`          int    NOT NULL AUTO_INCREMENT,
    `room_id`     bigint NOT NULL,
    `member_id`   bigint NOT NULL,
    `resume_id`   bigint NOT NULL,
    `join_date`   datetime(6) DEFAULT NULL,
    `leave_date`  datetime(6) DEFAULT NULL,
    `create_date` datetime(6) NOT NULL,
    `update_date` datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY           `idx_room_participant_room_id` (`room_id`),
    KEY           `idx_room_participant_member_id` (`member_id`),
    KEY           `idx_room_participant_resume_id` (`resume_id`),
    CONSTRAINT `fk_room_participant_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
    CONSTRAINT `fk_room_participant_member` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
    CONSTRAINT `fk_room_participant_resume` FOREIGN KEY (`resume_id`) REFERENCES `resume` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `question`
(
    `id`           bigint                                  NOT NULL AUTO_INCREMENT,
    `interview_id` bigint                                  NOT NULL,
    `parent_id`    bigint DEFAULT NULL,
    `content`      varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `model_answer` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `create_date`  datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY            `idx_question_parent_id` (`parent_id`),
    KEY            `idx_question_interview_id` (`interview_id`),
    CONSTRAINT `fk_question_interview` FOREIGN KEY (`interview_id`) REFERENCES `interview` (`id`),
    CONSTRAINT `fk_question_parent` FOREIGN KEY (`parent_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user_answer`
(
    `id`          bigint                                  NOT NULL AUTO_INCREMENT,
    `question_id` bigint                                  NOT NULL,
    `content`     varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `audio_path`  varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `create_date` datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY           `idx_user_answer_question_id` (`question_id`),
    CONSTRAINT `fk_user_answer_question` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `message`
(
    `id`                  int                                     NOT NULL AUTO_INCREMENT,
    `room_participant_id` int                                     NOT NULL,
    `content`             varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `create_date`         datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY                   `idx_message_room_participant_id` (`room_participant_id`),
    CONSTRAINT `fk_message_room_participant` FOREIGN KEY (`room_participant_id`) REFERENCES `room_participant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `feedback`
(
    `id`                      bigint NOT NULL AUTO_INCREMENT,
    `sender_participant_id`   int    NOT NULL,
    `receiver_participant_id` int    NOT NULL,
    `content`                 text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `create_date`             datetime(6) NOT NULL,
    `update_date`             datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY                       `idx_feedback_sender_id` (`sender_participant_id`),
    KEY                       `idx_feedback_receiver_id` (`receiver_participant_id`),
    CONSTRAINT `fk_feedback_receiver` FOREIGN KEY (`receiver_participant_id`) REFERENCES `room_participant` (`id`),
    CONSTRAINT `fk_feedback_sender` FOREIGN KEY (`sender_participant_id`) REFERENCES `room_participant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
