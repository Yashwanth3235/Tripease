package com.example1.flight.service;

import com.example1.entity.Booking;
import com.example1.repo.BookingRepository;
import com.example1.request.BookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking saveBooking(BookingRequest request) {

        Booking booking = new Booking();

        booking.setEmail(request.getEmail());
        booking.setFromLocation(request.getFrom());
        booking.setToLocation(request.getTo());
        booking.setTravelDate(request.getDate());
        booking.setPrice(request.getPrice());
        booking.setName(request.getName());

        return bookingRepository.save(booking);
    }
}