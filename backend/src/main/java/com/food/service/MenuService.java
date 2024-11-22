// src/main/java/com/food/service/MenuService.java
package com.food.service;

import com.food.dto.MenuDTO;
import com.food.mapper.MenuMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {

    @Autowired
    private MenuMapper menuMapper;

    //모든 매뉴 가져오기
    public List<MenuDTO> getMenuList() {
        return menuMapper.getMenuList();
    }

    // 정보센터식당 메뉴 가져오기
    public List<MenuDTO> getInfoRestaurantMenu() { return menuMapper.getInfoRestaurantMenu(); }

    public List<MenuDTO> getGongsikdangMenu() { return menuMapper.getGongsikdangMenu(); }

    public List<MenuDTO> getGongsikdang_BMenu() { return menuMapper.getGongsikdang_BMenu(); }

    public List<MenuDTO> getGongsikdang_CMenu() { return menuMapper.getGongsikdang_CMenu(); }

    public List<MenuDTO> getGongsikdang_DMenu() { return menuMapper.getGongsikdang_DMenu(); }

    public List<MenuDTO> getCafeMenu() { return menuMapper.getCafeMenu(); }


    public List<MenuDTO> getInfoRestaurantMenu() {
        return menuMapper.getInfoRestaurantMenu();
    }

    // 카페테리아 첨성 메뉴 가져오기
    public List<MenuDTO> getCafeteriaMenu() {
        return menuMapper.getCafeteriaMenu();
    }
}