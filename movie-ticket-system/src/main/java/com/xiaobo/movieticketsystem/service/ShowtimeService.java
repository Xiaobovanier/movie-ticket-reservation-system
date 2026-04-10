package com.xiaobo.movieticketsystem.service;

import com.xiaobo.movieticketsystem.dto.ShowtimeRequest;
import com.xiaobo.movieticketsystem.entity.Movie;
import com.xiaobo.movieticketsystem.entity.Room;
import com.xiaobo.movieticketsystem.entity.Showtime;
import com.xiaobo.movieticketsystem.repository.MovieRepository;
import com.xiaobo.movieticketsystem.repository.RoomRepository;
import com.xiaobo.movieticketsystem.repository.ShowtimeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    public ShowtimeService(ShowtimeRepository showtimeRepository,
                           MovieRepository movieRepository,
                           RoomRepository roomRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.roomRepository = roomRepository;
    }

    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    public Showtime getShowtimeById(Long id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
    }

    public List<Showtime> getShowtimesByMovieId(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    public Showtime createShowtime(ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Showtime showtime = new Showtime();
        showtime.setStartTime(LocalDateTime.parse(request.getStartTime()));
        showtime.setEndTime(LocalDateTime.parse(request.getEndTime()));
        showtime.setPrice(request.getPrice());
        showtime.setStatus(request.getStatus());
        showtime.setMovie(movie);
        showtime.setRoom(room);

        return showtimeRepository.save(showtime);
    }

    public Showtime updateShowtime(Long id, ShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        showtime.setStartTime(LocalDateTime.parse(request.getStartTime()));
        showtime.setEndTime(LocalDateTime.parse(request.getEndTime()));
        showtime.setPrice(request.getPrice());
        showtime.setStatus(request.getStatus());
        showtime.setMovie(movie);
        showtime.setRoom(room);

        return showtimeRepository.save(showtime);
    }

    public void deleteShowtime(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        showtimeRepository.delete(showtime);
    }
}