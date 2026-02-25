package com.example1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example1.entity.Users;
import com.example1.request.LoginRequest;
import com.example1.service.UserService;

@RestController
public class UserController {
	
	@Autowired
	UserService userservice;
	
	@PostMapping("/addUser")
	@CrossOrigin(origins="http://localhost:5173")
	public Users addUser(@RequestBody Users user)
	{
		return userservice.addUser(user);
	}
	
	@PostMapping("/loginUser")
	@CrossOrigin(origins="http://localhost:5173")

	public Boolean loginUser(@RequestBody LoginRequest loginrequest)
		{
			return userservice.loginUser(loginrequest);
		}

}
