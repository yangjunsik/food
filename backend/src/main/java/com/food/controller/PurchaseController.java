package com.food.controller;

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

    // 구매 내역 조회
    @GetMapping("/purchases")
    public ResponseEntity<?> getPurchases(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userToken = token.substring(7); // "Bearer " 이후의 토큰 값 추출
        List<PurchaseDTO> purchases = purchaseService.getPurchasesByToken(userToken);

        if (purchases.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("구매 내역이 없습니다.");
        }

        return ResponseEntity.ok(purchases);
    }

    // 구매 데이터 저장
    @PostMapping("/purchases")
    public ResponseEntity<?> savePurchase(@RequestBody PurchaseDTO purchaseDTO, @RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userToken = token.substring(7); // "Bearer " 이후의 토큰 값 추출

        try {
            purchaseService.savePurchase(purchaseDTO, userToken);
            return ResponseEntity.status(HttpStatus.CREATED).body("구매 데이터 저장 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("구매 데이터 저장 중 오류 발생");
        }
    }

    // 포인트 적립 엔드포인트 추가
//    @PostMapping("/points/deposit")
//    public ResponseEntity<?> depositPoints(
//            @RequestBody Map<String, Integer> request,
//            @RequestHeader("Authorization") String token) {
//        if (token == null || !token.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }
//
//        String userId = jwtUtil.extractUsername(token.substring(7));
//        int amount = request.getOrDefault("amount", 0);
//
//        if (amount <= 0) {
//            return ResponseEntity.badRequest().body("Invalid amount");
//        }
//
//        // PurchaseService를 재활용하여 포인트 처리
//        purchaseService.addPoints(userId, amount);
//        return ResponseEntity.ok("포인트 적립 성공");
//    }
//
//    // 포인트 조회 엔드포인트
//    @GetMapping("/points")
//    public ResponseEntity<?> getPoints(@RequestHeader("Authorization") String token) {
//        if (token == null || !token.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }
//
//        String userId = jwtUtil.extractUsername(token.substring(7));
//        int points = purchaseService.getPoints(userId);
//        return ResponseEntity.ok(Map.of("points", points));
//    }

}
