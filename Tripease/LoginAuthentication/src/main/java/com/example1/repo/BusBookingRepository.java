package com.example1.repo;

import com.example1.entity.BusBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusBookingRepository extends JpaRepository<BusBooking, Long> {
}