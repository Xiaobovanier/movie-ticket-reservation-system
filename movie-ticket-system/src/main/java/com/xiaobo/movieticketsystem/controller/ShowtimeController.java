package com.xiaobo.movieticketsystem.controller;

import com.xiaobo.movieticketsystem.dto.ShowtimeRequest;
import com.xiaobo.movieticketsystem.entity.Showtime;
import com.xiaobo.movieticketsystem.service.AdminSecurityService;
import com.xiaobo.movieticketsystem.service.ShowtimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/showtimes")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowtimeController {

    private final ShowtimeService showtimeService;
    private final AdminSecurityService adminSecurityService;

    public ShowtimeController(ShowtimeService showtimeService,
                              AdminSecurityService adminSecurityService) {
        this.showtimeService = showtimeService;
        this.adminSecurityService = adminSecurityService;
    }

    @GetMapping
    public ResponseEntity<List<Showtime>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Showtime> getShowtimeById(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Showtime>> getShowtimesByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovieId(movieId));
    }

    @PostMapping
    public ResponseEntity<Showtime> createShowtime(@RequestBody ShowtimeRequest request,
                                                   Authentication authentication) {
        adminSecurityService.requireAdmin(authentication);
        return ResponseEntity.ok(showtimeService.createShowtime(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Showtime> updateShowtime(@PathVariable Long id,
                                                   @RequestBody ShowtimeRequest request,
                                                   Authentication authentication) {
        adminSecurityService.requireAdmin(authentication);
        return ResponseEntity.ok(showtimeService.updateShowtime(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShowtime(@PathVariable Long id, Authentication authentication) {
        adminSecurityService.requireAdmin(authentication);
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok("Showtime deleted successfully");
    }
}