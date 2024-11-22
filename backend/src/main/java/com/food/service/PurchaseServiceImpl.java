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
        // JWT에서 userId 추출
        String userId = jwtUtil.extractUsername(userToken);
        return purchaseMapper.findPurchasesByUserId(userId);
    }

    @Override
    public void savePurchase(PurchaseDTO purchaseDTO, String userToken) {
        // JWT에서 userId 추출
        String userId = jwtUtil.extractUsername(userToken);
        purchaseDTO.setUserId(userId);

        // 구매 정보를 DB에 저장
        purchaseMapper.insertPurchase(purchaseDTO);

        // 각 아이템을 DB에 저장
        for (ItemDTO item : purchaseDTO.getItems()) {
            item.setPurchaseId(purchaseDTO.getId()); // `purchaseId`를 설정
            purchaseMapper.insertItem(item);
        }
    }
}
