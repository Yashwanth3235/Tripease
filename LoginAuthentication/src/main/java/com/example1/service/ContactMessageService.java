package com.example1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example1.entity.ContactMessage;
import com.example1.repo.ContactMessageRepo;

@Service
public class ContactMessageService {

    @Autowired
    ContactMessageRepo contactRepo;

    public ContactMessage addMessage(ContactMessage message) {
        return contactRepo.save(message);
    }

    public List<ContactMessage> getAllMessages() {
        return contactRepo.findAll();
    }
}