package com.example1.repo;

import com.example1.entity.TrainBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainBookingRepository extends JpaRepository<TrainBooking, Long> {
}