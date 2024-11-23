package com.food.service;

import com.food.dto.PurchaseDTO;

import java.util.List;

public interface PurchaseService {
    List<PurchaseDTO> getPurchasesByToken(String userToken);
    void savePurchase(PurchaseDTO purchaseDTO, String userToken);
    // 포인트 관련 메서드 추가
    void addPoints(String userId, int amount);
    int getPoints(String userId);
    void deductPoints(String userId, int amount);
}
