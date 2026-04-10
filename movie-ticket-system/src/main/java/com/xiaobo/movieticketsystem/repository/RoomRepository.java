package com.xiaobo.movieticketsystem.repository;

import com.xiaobo.movieticketsystem.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}