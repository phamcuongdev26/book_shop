package buy_book.configuration;

import buy_book.constant.Role;
import buy_book.entity.User;
import buy_book.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
public class ApplicationConfig {

    private final PasswordEncoder passwordEncoder;

    public ApplicationConfig(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@bookshop.com").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .fullName("ADMIN")
                        .email("admin@bookshop.com")
                            .password(passwordEncoder.encode("123456"))
                        .role(Role.ADMIN)
                        .isActive(true)
                        .build();
                userRepository.save(admin);
                log.warn("Admin user has been created: admin / 123456");
            }
        };
    }
}