package com.example1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example1.entity.Trip;
import com.example1.service.TripService;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173")
public class TripController {

    @Autowired
    private TripService tripService;

    @PostMapping
    public Trip saveTrip(@RequestBody Trip trip) {
        System.out.println("🔥 Trip API HIT");
        return tripService.saveTrip(trip);
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }
}