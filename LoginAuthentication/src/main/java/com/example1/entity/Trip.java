package com.example1.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String destination;

    private LocalDate startDate;
    private LocalDate endDate;

    private String travelStyle; // store as comma separated

    private Double budget;

    private Integer members;
    private String mail;
    private Long phone;

    public Trip() {}

    public Trip(Long id, String destination, LocalDate startDate, LocalDate endDate,
                String travelStyle, Double budget, Integer members, String mail, Long phone) {
        this.id = id;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.travelStyle = travelStyle;
        this.budget = budget;
        this.members = members;
        this.mail = mail;
        this.phone = phone;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getDestination() { return destination; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getTravelStyle() { return travelStyle; }
    public Double getBudget() { return budget; }
    public Integer getMembers() { return members; }
    public String getMail() { return mail; }
    public Long getPhone() { return phone; }

    public void setId(Long id) { this.id = id; }
    public void setDestination(String destination) { this.destination = destination; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setTravelStyle(String travelStyle) { this.travelStyle = travelStyle; }
    public void setBudget(Double budget) { this.budget = budget; }
    public void setMembers(Integer members) { this.members = members; }
    public void setMail(String mail) { this.mail = mail; }
    public void setPhone(Long phone) { this.phone = phone; }
}