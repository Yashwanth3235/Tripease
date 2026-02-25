package com.example1.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Users {
	@Id
	private String name;
	
	private String mail;
	
	private long phone;
	
	private String password;
	
	public Users() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Users(String name, String mail, long phone, String password) {
		super();
		this.name = name;
		this.mail = mail;
		this.phone = phone;
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public long getPhone() {
		return phone;
	}

	public void setPhone(long phone) {
		this.phone = phone;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
