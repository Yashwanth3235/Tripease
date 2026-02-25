package com.example1.entity;

import jakarta.persistence.*;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;      // ✅ ADD THIS
    private String email;
    private String fromLocation;
    private String toLocation;
    private String travelDate;
    private Double price;

    // ===== Getters & Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }        // ✅ ADD
    public void setName(String name) { this.name = name; }  // ✅ ADD

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public String getTravelDate() { return travelDate; }
    public void setTravelDate(String travelDate) { this.travelDate = travelDate; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}