package com.xiaobo.movieticketsystem.repository;

import com.xiaobo.movieticketsystem.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}