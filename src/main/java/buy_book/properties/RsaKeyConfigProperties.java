package buy_book.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
@Data
@ConfigurationProperties(prefix = "rsa")
public class RsaKeyConfigProperties {
    RSAPrivateKey privateKey;

    RSAPublicKey publicKey;


}