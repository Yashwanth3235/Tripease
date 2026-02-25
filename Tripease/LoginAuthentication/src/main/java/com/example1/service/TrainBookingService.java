package com.example1.service;

import com.example1.entity.TrainBooking;
import com.example1.repo.TrainBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainBookingService {

    @Autowired
    private TrainBookingRepository repository;

    // Save a booking
    public TrainBooking saveBooking(TrainBooking booking) {
        return repository.save(booking);
    }

    // Get all bookings
    public List<TrainBooking> getAllBookings() {
        return repository.findAll();
    }
}