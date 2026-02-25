package com.example1.hotel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import com.example1.hotel.service.HotelService.HotelService;

import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:5173")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private JavaMailSender mailSender;

    // ✅ 1️⃣ Get Hotels by City
    @GetMapping("/by-city")
    public ResponseEntity<?> getHotels(@RequestParam String cityCode) {

        String response = hotelService.getHotelsByCity(cityCode);

        return ResponseEntity.ok(response);
    }

    // ✅ 2️⃣ Confirm Hotel Booking + Send Email
    @PostMapping("/confirm-booking")
    public ResponseEntity<?> confirmHotelBooking(@RequestBody Map<String, String> data) {

        try {

            // 🔹 Create Email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(data.get("email"));
            message.setSubject("Hotel Booking Confirmation 🏨");

            message.setText(
                    "Your hotel booking is confirmed!\n\n" +
                    "Hotel Name: " + data.get("hotelName") + "\n" +
                    "City: " + data.get("city") + "\n" +
                    "Check-In: " + data.get("checkIn") + "\n" +
                    "Check-Out: " + data.get("checkOut") + "\n" +
                    "Guests: " + data.get("guests") + "\n" +
                    "Rooms: " + data.get("rooms") + "\n" +
                    "Price: ₹" + data.get("price") + "\n\n" +
                    "Thank you for booking with TripEase."
            );

            // 🔹 Send Email
            mailSender.send(message);

            // 🔹 Response to Frontend
            return ResponseEntity.ok("Hotel booking confirmed & email sent");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error sending email: " + e.getMessage());
        }
    }
}