package com.example1.flight.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class FlightService {

    @Value("${flight.api.key}")
    private String apiKey;

    @Value("${flight.api.secret}")
    private String apiSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private String token;
    private long expiry = 0;

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

        Map res = restTemplate.postForObject(
                "https://test.api.amadeus.com/v1/security/oauth2/token",
                request,
                Map.class
        );

        token = res.get("access_token").toString();
        expiry = System.currentTimeMillis() + ((int) res.get("expires_in") - 60) * 1000L;
        return token;
    }

    // 🔹 CITY SEARCH (CACHED)
    @Cacheable("cities")
    public String searchCities(String keyword) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(getToken());

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url =
                    "https://test.api.amadeus.com/v1/reference-data/locations" +
                    "?subType=CITY&keyword=" + keyword + "&page[limit]=5";

            return restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();

        } catch (HttpClientErrorException.TooManyRequests e) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Amadeus rate limit exceeded. Please wait."
            );
        }
    }

    // 🔹 FLIGHT SEARCH
    public String searchFlights(String from, String to, String date, int passengers) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getToken());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String url =
                "https://test.api.amadeus.com/v2/shopping/flight-offers" +
                "?originLocationCode=" + from +
                "&destinationLocationCode=" + to +
                "&departureDate=" + date +
                "&adults=" + passengers +
                "&currencyCode=INR&max=20";

        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
    }
}
