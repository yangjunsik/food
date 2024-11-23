package com.food.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
public class PurchaseDTO {
    private Integer id; // Auto Increment된 고유 ID
    private String merchantUid; // 주문 고유 번호
    private String userId; // 사용자 ID
    private Date date; // 구매 날짜
    private Integer totalAmount; // 총 결제 금액
    private String paymentMethod; // 결제 방식
    private String status; // 주문 상태
    private List<ItemDTO> items; // 구매한 상품 리스트
}




