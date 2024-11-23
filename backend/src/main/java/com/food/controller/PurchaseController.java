package com.food.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.food.config.JwtUtil;
import com.food.dto.PurchaseDTO;
import com.food.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final JwtUtil jwtUtil;

    public PurchaseController(PurchaseService purchaseService, JwtUtil jwtUtil) {
        this.purchaseService = purchaseService;
        this.jwtUtil = jwtUtil;
    }

    private String extractUserId(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token format");
        }

        try {
            return jwtUtil.extractUsername(token.substring(7));
        } catch (Exception e) {
            throw new IllegalArgumentException("Malformed or invalid token");
        }
    }

    @GetMapping("/purchases")
    public ResponseEntity<?> getPurchases(@RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserId(token);
            List<PurchaseDTO> purchases = purchaseService.getPurchasesByToken(userId);

            if (purchases.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No purchase history found.");
            }

            return ResponseEntity.ok(purchases);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error occurred.");
        }
    }

    @PostMapping("/purchases")
    public ResponseEntity<?> savePurchase(
            @RequestBody Map<String, Object> requestBody,
            @RequestHeader("Authorization") String token
    ) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userId = jwtUtil.extractUsername(token.substring(7));
        Integer pointUsage = (Integer) requestBody.get("pointUsage");

        try {
            if (pointUsage != null && pointUsage > 0) {
                purchaseService.deductPoints(userId, pointUsage);
            }

            PurchaseDTO purchaseDTO = new ObjectMapper().convertValue(requestBody.get("purchase"), PurchaseDTO.class);
            purchaseDTO.setUserId(userId);
            purchaseService.savePurchase(purchaseDTO, token);

            return ResponseEntity.status(HttpStatus.CREATED).body("구매 데이터 저장 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("구매 데이터 저장 중 오류 발생");
        }
    }


    @PostMapping("/points/charge")
    public ResponseEntity<?> chargePoints(
            @RequestBody Map<String, Integer> requestBody,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserId(token);
            int amount = requestBody.getOrDefault("amount", 0);

            if (amount <= 0) {
                return ResponseEntity.badRequest().body("Invalid amount");
            }

            int bonus = amount >= 100000 ? (int) (amount * 0.1) : 0;
            int totalAmount = amount + bonus;

            purchaseService.addPoints(userId, totalAmount);
            return ResponseEntity.ok(Map.of(
                    "message", "Points charged successfully.",
                    "chargedAmount", amount,
                    "bonus", bonus,
                    "total", totalAmount
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error charging points.");
        }
    }

    @GetMapping("/points")
    public ResponseEntity<?> getPoints(@RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserId(token);
            int points = purchaseService.getPoints(userId);
            return ResponseEntity.ok(Map.of("points", points));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching points.");
        }
    }
}



