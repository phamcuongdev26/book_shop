package buy_book.service;

import buy_book.dto.request.LoginRequest;
import buy_book.dto.request.RegisterRequest;
import buy_book.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}