package com.example1.flight.controller;

import com.example1.entity.Booking;
import com.example1.flight.service.BookingService;
import com.example1.request.BookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book")
    public Booking bookFlight(@RequestBody BookingRequest request) {
        return bookingService.saveBooking(request);
    }
}