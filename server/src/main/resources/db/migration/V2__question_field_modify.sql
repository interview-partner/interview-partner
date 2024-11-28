ALTER TABLE question
    MODIFY COLUMN content TEXT;

ALTER TABLE question
    DROP COLUMN model_answer;
