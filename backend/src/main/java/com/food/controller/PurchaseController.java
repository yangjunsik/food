package com.food.controller;

import com.food.dto.PurchaseDTO;
import com.food.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
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
}
