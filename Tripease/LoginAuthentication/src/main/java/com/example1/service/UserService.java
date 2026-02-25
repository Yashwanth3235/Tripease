package com.example1.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example1.entity.Users;
import com.example1.repo.UsersRepo;
import com.example1.request.LoginRequest;

@Service
public class UserService {

	@Autowired
	UsersRepo userRepo;
	
	public Users addUser(Users user)
	{
		return userRepo.save(user);
		
	}
	
	public Boolean loginUser(LoginRequest loginrequest)
	{
	Optional<Users>	user=userRepo.findByMail(loginrequest.getUserId());
		if(user.isEmpty())
		{
			return false;
		}
		Users u1=user.get();
		
		if(!u1.getPassword().equals(loginrequest.getPassword()))
		{
			return false;	
		}
		return true;
	}
}
