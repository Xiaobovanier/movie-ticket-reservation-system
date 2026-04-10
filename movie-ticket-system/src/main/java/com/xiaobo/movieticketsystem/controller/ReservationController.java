package com.xiaobo.movieticketsystem.controller;

import com.xiaobo.movieticketsystem.dto.ReservationRequest;
import com.xiaobo.movieticketsystem.dto.ReservationResponse;
import com.xiaobo.movieticketsystem.service.AdminSecurityService;
import com.xiaobo.movieticketsystem.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationService reservationService;
    private final AdminSecurityService adminSecurityService;

    public ReservationController(ReservationService reservationService,
                                 AdminSecurityService adminSecurityService) {
        this.reservationService = reservationService;
        this.adminSecurityService = adminSecurityService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody ReservationRequest request,
                                                                 Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reservationService.createReservation(userEmail, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reservationService.getMyReservations(userEmail));
    }

    @GetMapping("/showtime/{showtimeId}/booked-seats")
    public ResponseEntity<List<Long>> getBookedSeatIdsByShowtimeId(@PathVariable Long showtimeId) {
        return ResponseEntity.ok(reservationService.getBookedSeatIdsByShowtimeId(showtimeId));
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations(Authentication authentication) {
        adminSecurityService.requireAdmin(authentication);
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long reservationId,
                                                    Authentication authentication) {
        String userEmail = authentication.getName();
        reservationService.cancelReservation(reservationId, userEmail);
        return ResponseEntity.ok("Reservation cancelled successfully");
    }
}