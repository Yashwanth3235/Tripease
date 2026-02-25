package com.example1.service;

import com.example1.entity.BusBooking;
import com.example1.repo.BusBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusBookingService {

    @Autowired
    private BusBookingRepository repository;

    public BusBooking saveBooking(BusBooking booking) {
        return repository.save(booking);
    }
}