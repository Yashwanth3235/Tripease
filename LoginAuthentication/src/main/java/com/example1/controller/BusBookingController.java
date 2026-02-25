package com.example1.controller;

import com.example1.entity.BusBooking;
import com.example1.repo.BusBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/busbooking")
@CrossOrigin(origins = "http://localhost:5173")
public class BusBookingController {

    @Autowired
    private BusBookingRepository repository;

    // ✅ Save Bus Booking
    @PostMapping("/save")
    public BusBooking saveBusBooking(@RequestBody BusBooking booking) {
        return repository.save(booking);
    }

    // ✅ Get All Bus Bookings (for Admin Panel)
    @GetMapping("/all")
    public List<BusBooking> getAllBookings() {
        return repository.findAll();
    }
}