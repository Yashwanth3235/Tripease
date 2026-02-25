package com.example1.bus.controller;

import com.example1.bus.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "http://localhost:5173")
public class BusController {

    @Autowired
    private BusService busService;

    @Autowired
    private JavaMailSender mailSender;

    //GET BUSES BETWEEN CITIES
    @GetMapping("/between")
    public ResponseEntity<String> getBusesBetween(
            @RequestParam String from,
            @RequestParam String to) {

        return ResponseEntity.ok(
                busService.getBusesBetween(from, to)
        );
    }

    // BOOK BUS
    @PostMapping("/book")
    public ResponseEntity<?> bookBus(@RequestBody Map<String, String> data) {

        // 1️⃣ Create email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(data.get("email"));
        message.setSubject("Bus Booking Confirmation 🚌");

        message.setText(
                "Your bus booking is confirmed!\n\n" +
                "Operator: " + data.get("operator") + "\n" +
                "From: " + data.get("from") + "\n" +
                "To: " + data.get("to") + "\n" +
                "Date: " + data.get("date") + "\n" +
                "Seats: " + data.get("seats") + "\n" +
                "Fare: ₹" + data.get("fare") + "\n\n" +
                "Thank you for booking with TripEase."
        );

        // Send email
        mailSender.send(message);

        // 3️⃣ Respond
        return ResponseEntity.ok("Bus booking confirmed & email sent");
    }
}
