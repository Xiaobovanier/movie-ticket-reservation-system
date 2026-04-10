package com.xiaobo.movieticketsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MovieRequest {

    private String title;
    private String description;
    private Integer durationMinutes;
    private String rating;
    private String posterUrl;
    private Boolean active;
}