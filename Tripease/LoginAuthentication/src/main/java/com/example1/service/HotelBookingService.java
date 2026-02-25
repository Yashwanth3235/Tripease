package com.example1.service;

import com.example1.entity.HotelBooking;
import com.example1.repo.HotelBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelBookingService {

    @Autowired
    private HotelBookingRepository repository;

    // Save a hotel booking
    public HotelBooking saveBooking(HotelBooking booking) {
        return repository.save(booking);
    }

    // Get all hotel bookings
    public List<HotelBooking> getAllBookings() {
        return repository.findAll();
    }
}