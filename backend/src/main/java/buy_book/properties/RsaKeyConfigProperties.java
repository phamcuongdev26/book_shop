package buy_book.properties;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
@Getter
public class RsaKeyConfigProperties {

    private final RSAPublicKey publicKey;
    private final RSAPrivateKey privateKey;

    public RsaKeyConfigProperties(
            @Value("${RSA_PUBLIC_KEY}") String publicKeyPem,
            @Value("${RSA_PRIVATE_KEY}") String privateKeyPem
    ) throws Exception {
        this.publicKey = parsePublicKey(publicKeyPem);
        this.privateKey = parsePrivateKey(privateKeyPem);
    }

    private RSAPublicKey parsePublicKey(String pem) throws Exception {
        String clean = pem
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        return (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(clean)));
    }

    private RSAPrivateKey parsePrivateKey(String pem) throws Exception {
        String clean = pem
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        return (RSAPrivateKey) KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(Base64.getDecoder().decode(clean)));
    }
}