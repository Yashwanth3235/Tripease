package com.example1.controller;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example1.entity.Users;
import com.example1.repo.UsersRepo;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class GoogleAuthController {

    private static final String CLIENT_ID =
        "420090409427-niqgruan9blliqvoe9u9qqhmrhn3f5kb.apps.googleusercontent.com";
    @Autowired
    private UsersRepo usersRepo;

    @PostMapping("/auth/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {

        try {
            String token = body.get("token");

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);

            if (idToken == null) {
                return ResponseEntity.status(401).body("Invalid Google Token");
            }

            Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            Optional<Users> optionalUser = usersRepo.findByMail(email);

            Users user;
            if (optionalUser.isPresent()) {
                user = optionalUser.get();
            } else {
                user = new Users();
                user.setName(name);
                user.setMail(email);
                user.setPhone(0);
                user.setPassword("GOOGLE"); // dummy password
                usersRepo.save(user);
            }

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Google Login Failed");
        }
    }
}
