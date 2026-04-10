package com.xiaobo.movieticketsystem.controller;

import com.xiaobo.movieticketsystem.dto.SeatRequest;
import com.xiaobo.movieticketsystem.entity.Seat;
import com.xiaobo.movieticketsystem.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    @GetMapping("/{id}")
    public Seat getSeatById(@PathVariable Long id) {
        return seatService.getSeatById(id);
    }

    @GetMapping("/room/{roomId}")
    public List<Seat> getSeatsByRoomId(@PathVariable Long roomId) {
        return seatService.getSeatsByRoomId(roomId);
    }

    @PostMapping
    public Seat createSeat(@RequestBody SeatRequest request) {
        return seatService.createSeat(request);
    }

    @PutMapping("/{id}")
    public Seat updateSeat(@PathVariable Long id, @RequestBody SeatRequest request) {
        return seatService.updateSeat(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return "Seat deleted successfully";
    }
}