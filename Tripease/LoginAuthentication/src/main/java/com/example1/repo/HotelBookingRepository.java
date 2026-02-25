package com.example1.repo;

import com.example1.entity.HotelBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelBookingRepository extends JpaRepository<HotelBooking, Long> {
    // Standard JPA methods: save(), findAll(), findById(), delete(), etc.
}