package com.xiaobo.movieticketsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomRequest {

    private String name;
    private Integer totalRows;
    private Integer totalCols;
}
