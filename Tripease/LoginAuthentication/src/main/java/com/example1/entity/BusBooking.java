package com.example1.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bus_bookings")
public class BusBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // ✅ Added
    private String email;
    private String fromLocation;
    private String toLocation;
    private LocalDate travelDate;
    private String fare;

    // Getters and Setters

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public String getFare() { return fare; }
    public void setFare(String fare) { this.fare = fare; }
}