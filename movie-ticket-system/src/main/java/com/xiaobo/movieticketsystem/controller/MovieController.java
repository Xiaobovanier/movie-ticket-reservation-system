package com.xiaobo.movieticketsystem.controller;

import com.xiaobo.movieticketsystem.dto.MovieRequest;
import com.xiaobo.movieticketsystem.entity.Movie;
import com.xiaobo.movieticketsystem.service.AdminSecurityService;
import com.xiaobo.movieticketsystem.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final MovieService movieService;
    private final AdminSecurityService adminSecurityService;

    public MovieController(MovieService movieService, AdminSecurityService adminSecurityService) {
        this.movieService = movieService;
        this.adminSecurityService = adminSecurityService;
    }

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody MovieRequest request,
                                             Authentication authentication) {
        adminSecurityService.requireAdmin(authentication);
        return ResponseEntity.ok(movieService.createMovie(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id,
                                             @RequestBody MovieRequest request,
                                             Authentication authentication) {
        adminSecurityService.requireAdmin(authentication);
        return ResponseEntity.ok(movieService.updateMovie(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id,
                                              Authentication authentication) {
        adminSecurityService.requireAdmin(authentication);
        movieService.deleteMovie(id);
        return ResponseEntity.ok("Movie deleted successfully");
    }
}