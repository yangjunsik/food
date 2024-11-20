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

    public boolean registerUser(UserDTO userDTO) {
        // 중복 ID 체크
        if (userMapper.findByUsername(userDTO.getId()) != null) {
            return false;
        }

        // 유저 정보 등록
        userMapper.insertUser(userDTO);
        return true;
    }

    public boolean isIdDuplicated(String id) {
        try {
            return userMapper.findByUsername(id) != null;
        } catch (Exception e) {
            System.err.println("중복 확인 중 오류 발생: " + e.getMessage());
            return false;
        }
    }


}




