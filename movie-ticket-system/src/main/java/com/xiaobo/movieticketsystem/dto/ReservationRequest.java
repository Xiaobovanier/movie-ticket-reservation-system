package com.xiaobo.movieticketsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ReservationRequest {

    private Long showtimeId;
    private List<Long> seatIds;
}