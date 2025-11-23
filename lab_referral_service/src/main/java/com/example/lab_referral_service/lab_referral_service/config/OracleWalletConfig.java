package com.example.lab_referral_service.lab_referral_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.File;

@Configuration
public class OracleWalletConfig {

    // Nombre de la carpeta del wallet
    @Value("${oracle.wallet.folder:Wallet_J5CZ0BX9RIVK63AW}") 
    private String walletFolderName;

    @PostConstruct
    public void setTnsAdminPath() {
        try {
            // Obtener el directorio de trabajo actual (la raíz del proyecto)
            String currentDirectory = new File(".").getCanonicalPath();
            
            // Construir la ruta absoluta usando el separador de sistema correcto (File.separator)
            String tnsAdminPath = currentDirectory + File.separator + walletFolderName;

            // Establecer la propiedad del sistema que el driver de Oracle usa
            System.setProperty("oracle.net.tns_admin", tnsAdminPath);
            System.out.println("Oracle TNS_ADMIN configurado a: " + tnsAdminPath);
            
        } catch (Exception e) {
            System.err.println("ERROR al configurar la ruta de Oracle Wallet: " + e.getMessage());
            // Manejo de error o relanzar
        }
    }
}