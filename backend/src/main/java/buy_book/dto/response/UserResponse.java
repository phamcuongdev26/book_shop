package buy_book.dto.response;

import buy_book.constant.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String username;
    String email;
    String fullName;
    String phoneNumber;
    String address;
    String avatarUrl;
    Role role;

    @JsonProperty("isActive")
    boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}