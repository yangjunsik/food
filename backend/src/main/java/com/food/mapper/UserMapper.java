// backend/src/main/java/com/food/mapper/UserMapper.java
package com.food.mapper;

import com.food.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    UserDTO findByUsername(String id);

    void insertUser(UserDTO userDTO);
}

