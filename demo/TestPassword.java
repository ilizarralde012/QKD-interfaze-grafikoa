import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("test123");
        System.out.println("INSERT INTO users (username, password, enabled) VALUES ('testuser', '" + hash + "', 1);");
        System.out.println("INSERT INTO users (username, password, enabled) VALUES ('demo', '" + hash + "', 1);");
    }
}