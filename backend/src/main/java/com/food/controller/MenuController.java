// src/main/java/com/food/controller/MenuController.java
package com.food.controller;

import com.food.config.JwtUtil;
import com.food.dto.MenuDTO;
import com.food.service.MenuService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/menu")
    public ResponseEntity<List<MenuDTO>> getMenu(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 제거

            try {
                Claims claims = jwtUtil.extractClaims(token); // 토큰에서 클레임 추출
                String userId = claims.getSubject(); // 사용자 ID 확인

                if (userId != null) {
                    return ResponseEntity.ok(menuService.getMenuList());
                }
            } catch (Exception e) {
                System.out.println("Invalid JWT Token: " + e.getMessage());
            }
        }

        // 인증 실패 시 401 Unauthorized 반환
        return ResponseEntity.status(401).build();
    }

    // 정보센터식당 메뉴 가져오기
    @GetMapping("/menu/info")
    public ResponseEntity<List<MenuDTO>> getInfoRestaurantMenu() {
        System.out.println("정보센터 매뉴 보내기 성공");
        List<MenuDTO> menuList = menuService.getInfoRestaurantMenu();
        return ResponseEntity.ok(menuList);
    }

    @GetMapping("/menu/info/a")
    public ResponseEntity<List<MenuDTO>> getGongsikdangMenu() {
        System.out.println("공식당 A 매뉴 보내기 성공");
        List<MenuDTO> menuList = menuService.getGongsikdangMenu();
        return ResponseEntity.ok(menuList);
    }
    @GetMapping("/menu/info/b")
    public ResponseEntity<List<MenuDTO>> getGongsikdang_BMenu() {
        System.out.println("공식당 B 매뉴 보내기 성공");
        List<MenuDTO> menuList = menuService.getGongsikdang_BMenu();
        return ResponseEntity.ok(menuList);
    }
    @GetMapping("/menu/info/c")
    public ResponseEntity<List<MenuDTO>> getGongsikdang_CMenu() {
        System.out.println("공식당 C 매뉴 보내기 성공");
        List<MenuDTO> menuList = menuService.getGongsikdang_CMenu();
        return ResponseEntity.ok(menuList);
    }
    @GetMapping("/menu/info/d")
    public ResponseEntity<List<MenuDTO>> getGongsikdang_DMenu() {
        System.out.println("공식당 D 매뉴 보내기 성공");
        List<MenuDTO> menuList = menuService.getGongsikdang_DMenu();
        return ResponseEntity.ok(menuList);
    }
    @GetMapping("/menu/info/cafe")
    public ResponseEntity<List<MenuDTO>> getCafeMenu() {
        System.out.println("카페테리아 첨성 매뉴 보내기 성공");
        List<MenuDTO> menuList = menuService.getCafeMenu();
        return ResponseEntity.ok(menuList);
    }

    // 카페테리아 첨성 메뉴 가져오기
    @GetMapping("/menu/cafe")
    public ResponseEntity<List<MenuDTO>> getCafeteriaMenu() {
        System.out.println("카페테리아 첨성 메뉴 보내기 성공");
        List<MenuDTO> menuList = menuService.getCafeteriaMenu();
        return ResponseEntity.ok(menuList);
    }

    @PostMapping("/menu/reduce")
    public ResponseEntity<String> reduceMenuQuantity(
            @RequestHeader("Authorization") String token,
            @RequestBody List<Map<String, Object>> cart) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);

            try {
                Claims claims = jwtUtil.extractClaims(token);
                String userId = claims.getSubject();

                if (userId != null) {
                    for (Map<String, Object> item : cart) {
                        String name = (String) item.get("name");
                        int quantity = (int) item.get("quantity");

                        boolean isReduced = menuService.reduceMenuQuantity(name, quantity);

                        if (!isReduced) {
                            return ResponseEntity.status(400).body("재고 부족: " + name);
                        }
                    }
                    return ResponseEntity.ok("모든 재고 감소 완료");
                }
            } catch (Exception e) {
                System.out.println("Invalid JWT Token: " + e.getMessage());
                return ResponseEntity.status(401).body("Invalid Token");
            }
        }
        return ResponseEntity.status(401).body("Unauthorized");
    }


}

