package com.example1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example1.entity.Trip;
import com.example1.repo.TripRepo;

@Service
public class TripService {

    @Autowired
    private TripRepo repo;

    public Trip saveTrip(Trip trip) {
        return repo.save(trip);
    }

    public List<Trip> getAllTrips() {
        return repo.findAll();
    }
}