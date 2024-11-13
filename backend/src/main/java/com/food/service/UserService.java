// backend/src/main/java/com/food/service/UserService.java
package com.food.service;

import com.food.dto.UserDTO;
import com.food.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    public boolean authenticateUser(UserDTO userDTO) {
        System.out.println("Authenticating user with ID: " + userDTO.getId());
        UserDTO userFromDB = userMapper.findByUsername(userDTO.getId());

        if (userFromDB == null) {
            System.out.println("User not found in database for ID: " + userDTO.getId());
            return false;
        }

        System.out.println("Database Password: " + userFromDB.getPassword());
        System.out.println("Input Password: " + userDTO.getPassword());

        // 비밀번호 일치 여부 확인 (테스트용)
        boolean isPasswordMatch = "123".equals(userDTO.getPassword());
        if (!isPasswordMatch) {
            System.out.println("Password mismatch for user ID: " + userDTO.getId());
        }

        return isPasswordMatch;
    }
}




