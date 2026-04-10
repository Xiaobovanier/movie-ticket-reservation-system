package com.xiaobo.movieticketsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ShowtimeRequest {

    private String startTime;
    private String endTime;
    private Double price;
    private String status;
    private Long movieId;
    private Long roomId;
}
