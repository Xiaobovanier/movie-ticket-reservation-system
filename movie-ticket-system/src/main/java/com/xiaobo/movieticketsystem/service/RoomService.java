package com.xiaobo.movieticketsystem.service;

import com.xiaobo.movieticketsystem.dto.RoomRequest;
import com.xiaobo.movieticketsystem.entity.Room;
import com.xiaobo.movieticketsystem.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room createRoom(RoomRequest request) {
        Room room = new Room();
        room.setName(request.getName());
        room.setTotalRows(request.getTotalRows());
        room.setTotalCols(request.getTotalCols());

        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setName(request.getName());
        room.setTotalRows(request.getTotalRows());
        room.setTotalCols(request.getTotalCols());

        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        roomRepository.delete(room);
    }
}
