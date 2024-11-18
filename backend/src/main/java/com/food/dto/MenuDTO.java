package com.food.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MenuDTO {
    private String name;
    private String price;
    private String image;
    private int number;
    private String sector;
    private String restaurantName;
}
