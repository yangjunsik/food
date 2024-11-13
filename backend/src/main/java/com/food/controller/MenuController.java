// src/main/java/com/food/controller/MenuController.java
package com.food.controller;

import com.food.dto.MenuDTO;
import com.food.service.MenuService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/menu")
    public ResponseEntity<List<MenuDTO>> getMenu(HttpSession session) {
        Object userId = session.getAttribute("user");
        System.out.println("Session ID on /menu access: " + session.getId());
        System.out.println("User ID in session on /menu access: " + userId);

        if (userId != null) {
            return ResponseEntity.ok(menuService.getMenuList());
        } else {
            return ResponseEntity.status(401).build(); // 세션이 유효하지 않으면 401 Unauthorized 반환
        }

    }
}

