package com.example1.train.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TrainService {

    @Value("${train.api.key}")
    private String apiKey;

    @Value("${train.api.host}")
    private String apiHost;

    private final RestTemplate restTemplate = new RestTemplate();

    // 🚆 TRAINS BETWEEN STATIONS
    public String getTrainsBetween(String from, String to) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", apiKey);
        headers.set("x-rapidapi-host", apiHost);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String url = "https://" + apiHost +
                "/v1/trains/between?offset=0" +
                "&from=" + from +
                "&to=" + to +
                "&limit=50";

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }
}
