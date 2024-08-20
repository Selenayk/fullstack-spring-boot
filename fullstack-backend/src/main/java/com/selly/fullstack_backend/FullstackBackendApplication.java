package com.selly.fullstack_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FullstackBackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
		System.setProperty("JWT_ACCESS_TOKEN_EXPIRATION", dotenv.get("JWT_ACCESS_TOKEN_EXPIRATION"));
		System.setProperty("JWT_REFRESH_TOKEN_EXPIRATION", dotenv.get("JWT_REFRESH_TOKEN_EXPIRATION"));

		SpringApplication.run(FullstackBackendApplication.class, args);
	}

}
