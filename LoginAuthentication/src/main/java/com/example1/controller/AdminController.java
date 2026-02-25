package com.example1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example1.entity.Users;
import com.example1.entity.Booking;
import com.example1.entity.BusBooking;
import com.example1.entity.TrainBooking;
import com.example1.entity.HotelBooking;
import com.example1.entity.Trip;
import com.example1.entity.ContactMessage;

import com.example1.repo.UsersRepo;
import com.example1.repo.BookingRepository;
import com.example1.repo.BusBookingRepository;
import com.example1.repo.TrainBookingRepository;
import com.example1.repo.HotelBookingRepository;
import com.example1.repo.TripRepo;
import com.example1.service.ContactMessageService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    // -------------------- REPOSITORIES & SERVICES --------------------
    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusBookingRepository busBookingRepository;

    @Autowired
    private TrainBookingRepository trainBookingRepository;

    @Autowired
    private HotelBookingRepository hotelBookingRepository;

    @Autowired
    private TripRepo tripRepo;

    @Autowired
    private ContactMessageService contactService;

    // -------------------- USERS --------------------
    @GetMapping("/users")
    public List<Users> getAllUsers() {
        return usersRepo.findAll();
    }

    // -------------------- FLIGHT BOOKINGS --------------------
    @GetMapping("/flightbooking")
    public List<Booking> getAllFlightBookings() {
        return bookingRepository.findAll();
    }

    // -------------------- BUS BOOKINGS --------------------
    @GetMapping("/busbooking")
    public List<BusBooking> getAllBusBookings() {
        return busBookingRepository.findAll();
    }

    @PostMapping("/busbooking")
    public ResponseEntity<?> addBusBooking(@RequestBody BusBooking busBooking) {
        try {
            BusBooking savedBooking = busBookingRepository.save(busBooking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error saving bus booking: " + e.getMessage());
        }
    }

    // -------------------- TRAIN BOOKINGS --------------------
    @GetMapping("/trainbooking")
    public List<TrainBooking> getAllTrainBookings() {
        return trainBookingRepository.findAll();
    }

    @PostMapping("/trainbooking")
    public ResponseEntity<?> addTrainBooking(@RequestBody TrainBooking trainBooking) {
        try {
            TrainBooking savedBooking = trainBookingRepository.save(trainBooking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error saving train booking: " + e.getMessage());
        }
    }

    // -------------------- HOTEL BOOKINGS --------------------
    @GetMapping("/hotelbooking")
    public List<HotelBooking> getAllHotelBookings() {
        return hotelBookingRepository.findAll();
    }

    @PostMapping("/hotelbooking")
    public ResponseEntity<?> addHotelBooking(@RequestBody HotelBooking hotelBooking) {
        try {
            HotelBooking savedBooking = hotelBookingRepository.save(hotelBooking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error saving hotel booking: " + e.getMessage());
        }
    }

    // -------------------- TRIP BOOKINGS --------------------
    @GetMapping("/trips")
    public List<Trip> getAllTrips() {
        return tripRepo.findAll();
    }

    @PostMapping("/trips")
    public ResponseEntity<?> addTrip(@RequestBody Trip trip) {
        try {
            Trip savedTrip = tripRepo.save(trip);
            return ResponseEntity.ok(savedTrip);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error saving trip: " + e.getMessage());
        }
    }

    // -------------------- CONTACT MESSAGES --------------------
    @GetMapping("/contactmessages")
    public List<ContactMessage> getAllContactMessages() {
        return contactService.getAllMessages();
    }

    @PostMapping("/contactmessages")
    public ResponseEntity<?> addContactMessage(@RequestBody ContactMessage message) {
        try {
            ContactMessage savedMessage = contactService.addMessage(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error saving contact message: " + e.getMessage());
        }
    }
}