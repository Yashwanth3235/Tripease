package com.example1.controller;

import com.example1.entity.HotelBooking;
import com.example1.service.HotelBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:5173")
public class HotelBookingController {

    @Autowired
    private HotelBookingService service;

    // POST: Save a hotel booking
    @PostMapping("/book")
    public ResponseEntity<?> saveHotelBooking(@RequestBody HotelBooking booking) {
        try {
            HotelBooking saved = service.saveBooking(booking);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving hotel booking: " + e.getMessage());
        }
    }

    // GET: Get all hotel bookings
    @GetMapping("/all")
    public List<HotelBooking> getAllBookings() {
        return service.getAllBookings();
    }
}