package com.example1.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example1.entity.Users;

public interface UsersRepo extends JpaRepository<Users, String> {
	Optional<Users> findByMail(String mail);
}
