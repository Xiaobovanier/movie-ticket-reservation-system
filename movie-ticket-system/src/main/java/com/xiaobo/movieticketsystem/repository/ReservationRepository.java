package com.xiaobo.movieticketsystem.repository;

import com.xiaobo.movieticketsystem.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserEmail(String email);
}