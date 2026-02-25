package com.example1.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example1.entity.Trip;

public interface TripRepo extends JpaRepository<Trip, Long> {
}