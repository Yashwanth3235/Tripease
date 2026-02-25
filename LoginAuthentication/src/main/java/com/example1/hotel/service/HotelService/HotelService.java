package com.example1.hotel.service.HotelService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class HotelService {

    @Value("${amadeus.api.key}")
    private String apiKey;

    @Value("${amadeus.api.secret}")
    private String apiSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    private String token;
    private long expiry = 0;

    // 🔐 TOKEN GENERATION
    private String getToken() {

        if (token != null && System.currentTimeMillis() < expiry) {
            return token;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "grant_type=client_credentials" +
                "&client_id=" + apiKey +
                "&client_secret=" + apiSecret;

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        Map<String, Object> response = restTemplate.postForObject(
                "https://test.api.amadeus.com/v1/security/oauth2/token",
                request,
                Map.class
        );

        if (response == null || !response.containsKey("access_token")) {
            throw new RuntimeException("Failed to get Amadeus token");
        }

        token = response.get("access_token").toString();
        expiry = System.currentTimeMillis() +
                ((Integer) response.get("expires_in") - 60) * 1000L;

        return token;
    }

    // 🏨 GET HOTELS BY CITY
    public String getHotelsByCity(String cityCode) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getToken());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String url =
                "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city" +
                "?cityCode=" + cityCode;

        try {
            return restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            ).getBody();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching hotels from Amadeus");
        }
    }
}
