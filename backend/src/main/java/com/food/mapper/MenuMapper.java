// src/main/java/com/food/mapper/MenuMapper.java
package com.food.mapper;

import com.food.dto.MenuDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuMapper {
    //모든 매뉴 가져오는 함수
    List<MenuDTO> getMenuList();

    // 정보센터식당 메뉴 가져오기
    List<MenuDTO> getInfoRestaurantMenu();

    // 카페티리아 첨성 메뉴 가져오기
    List<MenuDTO> getCafeteriaMenu();
}
