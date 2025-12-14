package cl.duoc.analysis_service;

import java.io.File;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import cl.duoc.analysis_service.config.RestTemplateAuthInterceptor;

@SpringBootApplication
public class LabReferralServiceApplication {
	@Value("${service.user.internal-auth-token}")
    private String internalServiceToken;

	public static void main(String[] args) {
        try {
            // Ajusta el nombre de la carpeta si es necesario
            String walletFolderName = "Wallet_J5CZ0BX9RIVK63AW"; 
            String currentDirectory = new File(".").getCanonicalPath();
            String tnsAdminPath = currentDirectory + File.separator + walletFolderName;

            System.setProperty("oracle.net.tns_admin", tnsAdminPath);
            System.out.println(">> CONFIGURACIÓN PREVIA: TNS_ADMIN apuntando a: " + tnsAdminPath);
        } catch (Exception e) {
            System.err.println(">> ERROR PREVIO: No se pudo configurar TNS_ADMIN");
            e.printStackTrace();
        }

		SpringApplication.run(LabReferralServiceApplication.class, args);
	}

	@Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        // Añadir el interceptor para inyectar el token JWT
        restTemplate.setInterceptors(Collections.singletonList(
            new RestTemplateAuthInterceptor(internalServiceToken)
        ));
        return restTemplate;
    }
}
