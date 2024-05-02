package com.vip.interviewpartner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InterviewPartnerApplication {

	public static void main(String[] args) {
		SpringApplication.run(InterviewPartnerApplication.class, args);
	}

}
