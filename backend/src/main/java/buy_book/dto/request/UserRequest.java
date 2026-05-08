package buy_book.dto.request;

import buy_book.constant.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {

    @NotBlank(message = "Username không được để trống")
    String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    String email;

    String password;
    String fullName;
    String phoneNumber;
    String address;
    String avatarUrl;
    Role role;

    @JsonProperty("isActive")
    boolean isActive;
}