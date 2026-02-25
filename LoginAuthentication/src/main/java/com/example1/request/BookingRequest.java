package com.example1.request;

public class BookingRequest {

    private String name;     // ✅ ADD THIS
    private String email;
    private String from;
    private String to;
    private String date;
    private Double price;

    // ===== GETTERS & SETTERS =====

    public String getName() {        // ✅ ADD THIS
        return name;
    }

    public void setName(String name) {   // ✅ ADD THIS
        this.name = name;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}