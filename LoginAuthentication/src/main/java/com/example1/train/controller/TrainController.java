package com.example1.train.controller;

import com.example1.train.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "http://localhost:5173")
public class TrainController {

    @Autowired
    private TrainService trainService;

    @Autowired
    private JavaMailSender mailSender;

    // 🚆 GET TRAINS BETWEEN STATIONS
    @GetMapping("/between")
    public ResponseEntity<String> getTrainsBetween(
            @RequestParam String from,
            @RequestParam String to) {

        from = from.trim();
        to = to.trim();

        return ResponseEntity.ok(
                trainService.getTrainsBetween(from, to)
        );
    }

    // 📩 BOOK TRAIN + SEND EMAIL
    @PostMapping("/book")
    public ResponseEntity<?> bookTrain(@RequestBody Map<String, String> data) {

        // 1️⃣ Create Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(data.get("email"));
        message.setSubject("Train Booking Confirmation 🚆");

        message.setText(
                "Your train booking is confirmed!\n\n" +
                "From: " + data.get("from") + "\n" +
                "To: " + data.get("to") + "\n" +
                "Train Name: " + data.get("trainName") + "\n" +
                "Date: " + data.get("date") + "\n" +
                "Class: " + data.get("travelClass") + "\n" +
                "Price: " + data.get("price") + "\n\n" +
                "Thank you for booking with TripEase."
        );

        // 2️⃣ Send Email
        mailSender.send(message);

        // 3️⃣ Send Response to Frontend
        return ResponseEntity.ok("Train booking confirmed & email sent");
    }
}
