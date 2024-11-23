package com.food.service;

import com.food.dto.PurchaseDTO;
import com.food.dto.ItemDTO;
import com.food.mapper.PurchaseMapper;
import com.food.config.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseMapper purchaseMapper;
    private final JwtUtil jwtUtil;

    public PurchaseServiceImpl(PurchaseMapper purchaseMapper, JwtUtil jwtUtil) {
        this.purchaseMapper = purchaseMapper;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public List<PurchaseDTO> getPurchasesByToken(String userToken) {
        String userId = jwtUtil.extractUsername(userToken);
        return purchaseMapper.findPurchasesByUserId(userId);
    }

    @Override
    public void savePurchase(PurchaseDTO purchaseDTO, String userToken) {
        String userId = jwtUtil.extractUsername(userToken);
        purchaseDTO.setUserId(userId);

        // 구매 정보 저장
        purchaseMapper.insertPurchase(purchaseDTO);

        // 구매 상품 저장
        for (ItemDTO item : purchaseDTO.getItems()) {
            item.setPurchaseId(purchaseDTO.getId());
            purchaseMapper.insertItem(item);
        }
    }

    @Override
    public void addPoints(String userId, int amount) {
        purchaseMapper.updatePoints(userId, amount);
    }

    @Override
    public int getPoints(String userId) {
        Integer points = purchaseMapper.getPoints(userId);
        return points != null ? points : 0; // null인 경우 기본값 0
    }

    @Override
    public void deductPoints(String userId, int amount) {
        purchaseMapper.deductPoints(userId, amount);
    }
}

