package com.example1.controller;

import com.example1.entity.TrainBooking;
import com.example1.service.TrainBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainbooking")
@CrossOrigin(origins = "http://localhost:5173")
public class TrainBookingController {

    @Autowired
    private TrainBookingService service;

    // Save a train booking
    @PostMapping("/save")
    public TrainBooking saveTrainBooking(@RequestBody TrainBooking booking) {
        return service.saveBooking(booking);
    }

    // Get all train bookings
    @GetMapping("/all")
    public List<TrainBooking> getAllBookings() {
        return service.getAllBookings();  // ✅ Use the service method
    }
}