package com.example1.flight.controller;

import com.example1.flight.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @Autowired
    private JavaMailSender mailSender;

    // 🔍 CITY SEARCH
    @GetMapping("/cities")
    public ResponseEntity<?> searchCities(@RequestParam String keyword) {
        return ResponseEntity.ok(flightService.searchCities(keyword));
    }

    // ✈️ FLIGHT SEARCH
    @GetMapping("/search")
    public ResponseEntity<?> searchFlights(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String departDate,
            @RequestParam int passengers
    ) {
        return ResponseEntity.ok(
                flightService.searchFlights(from, to, departDate, passengers)
        );
    }

    // 📩 BOOK FLIGHT + SEND EMAIL
    @PostMapping("/book")
    public ResponseEntity<?> bookFlight(@RequestBody Map<String, String> data) {

        // 1️⃣ Create email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(data.get("email"));
        message.setSubject("Flight Booking Confirmation ✈️");

        message.setText(
                "Your flight booking is confirmed!\n\n" +
                "From: " + data.get("from") + "\n" +
                "To: " + data.get("to") + "\n" +
                "Date: " + data.get("date") + "\n" +
                "Price: " + data.get("price") + "\n\n" +
                "Thank you for booking with TripEase."
        );

        // 2️⃣ Send email
        mailSender.send(message);

        // 3️⃣ Respond to frontend
        return ResponseEntity.ok("Booking confirmed & email sent");
    }
}
