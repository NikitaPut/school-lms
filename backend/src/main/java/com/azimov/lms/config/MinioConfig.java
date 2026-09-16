package com.azimov.lms.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class MinioConfig {
    
    @Value("${spring.minio.endpoint}")
    private String endpoint;
    
    @Value("${spring.minio.access-key}")
    private String accessKey;
    
    @Value("${spring.minio.secret-key}")
    private String secretKey;
    
    @Value("${spring.minio.bucket-name}")
    private String bucketName;
    
    @Bean
    public MinioClient minioClient() {
        log.info("Инициализация MinIO клиента: {}", endpoint);
        
        MinioClient minioClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
        
        // Создаём bucket если его нет
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );
            
            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                );
                log.info("Создан bucket: {}", bucketName);
            } else {
                log.info("Bucket {} уже существует", bucketName);
            }
        } catch (Exception e) {
            log.error("Ошибка при инициализации MinIO: {}", e.getMessage());
        }
        
        return minioClient;
    }
}
