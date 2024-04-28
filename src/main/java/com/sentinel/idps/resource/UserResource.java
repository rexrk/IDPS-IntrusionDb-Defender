package com.sentinel.idps.resource;

import com.sentinel.idps.entity.UserDetails;
import com.sentinel.idps.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class UserResource {
    private final UserRepository userRepository;

    public UserResource(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //Create or Update a User
    public UserDetails updateUser(UserDetails user) {
        Optional<UserDetails> existingUser = Optional.ofNullable(userRepository.findByUsername(user.getUsername()));
        // User exists, update their information
        UserDetails existingUserData = existingUser.orElse(null);
        existingUserData.setUsername(user.getUsername());
        existingUserData.setIpAddress(user.getIpAddress());
        existingUserData.setExecutingQuery(user.getExecutingQuery());
        user.setEmail(user.getUsername().equals("admin") ? "admin@gmail.com" : "user@email.com");
        user.setRole(user.getUsername().equals("admin") ? "ADMIN" : "USER");
        return userRepository.save(existingUserData);

    }

    @GetMapping("/user/{username}")
    public UserDetails getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

}
