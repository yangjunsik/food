// src/main/java/com/food/mapper/MenuMapper.java
package com.food.mapper;

import com.food.dto.MenuDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuMapper {
    List<MenuDTO> getMenuList();
}
