package org.example.backendmac;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.example.backendmac")
public class BackEndMacApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackEndMacApplication.class, args);
	}

}
