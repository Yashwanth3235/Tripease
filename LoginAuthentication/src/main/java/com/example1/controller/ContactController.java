package com.example1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example1.entity.ContactMessage;
import com.example1.service.ContactMessageService;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private ContactMessageService contactService;

    @PostMapping
    public ContactMessage saveMessage(@RequestBody ContactMessage message) {
        System.out.println("🔥 API HIT");

        // Log the incoming object
        System.out.println("Received JSON:");
        System.out.println("FullName: " + message.getFullName());
        System.out.println("Email: " + message.getEmail());
        System.out.println("Message: " + message.getMessage());

        ContactMessage saved = contactService.addMessage(message);

        System.out.println("🔥 SAVED ID: " + saved.getId());
        return saved;
    }

    @GetMapping
    public java.util.List<ContactMessage> getAllMessages() {
        return contactService.getAllMessages();
    }
}