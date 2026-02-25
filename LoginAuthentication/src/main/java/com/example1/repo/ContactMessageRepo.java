package com.example1.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example1.entity.ContactMessage;

public interface ContactMessageRepo extends JpaRepository<ContactMessage, Long> {

}