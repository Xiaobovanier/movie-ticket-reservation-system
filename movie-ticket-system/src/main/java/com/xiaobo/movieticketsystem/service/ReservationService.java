package com.xiaobo.movieticketsystem.service;

import com.xiaobo.movieticketsystem.dto.ReservationRequest;
import com.xiaobo.movieticketsystem.dto.ReservationResponse;
import com.xiaobo.movieticketsystem.entity.Reservation;
import com.xiaobo.movieticketsystem.entity.ReservationSeat;
import com.xiaobo.movieticketsystem.entity.Seat;
import com.xiaobo.movieticketsystem.entity.Showtime;
import com.xiaobo.movieticketsystem.entity.User;
import com.xiaobo.movieticketsystem.exception.ForbiddenException;
import com.xiaobo.movieticketsystem.repository.ReservationRepository;
import com.xiaobo.movieticketsystem.repository.ReservationSeatRepository;
import com.xiaobo.movieticketsystem.repository.SeatRepository;
import com.xiaobo.movieticketsystem.repository.ShowtimeRepository;
import com.xiaobo.movieticketsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationSeatRepository reservationSeatRepository;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final AdminSecurityService adminSecurityService;

    public ReservationService(ReservationRepository reservationRepository,
                              ReservationSeatRepository reservationSeatRepository,
                              UserRepository userRepository,
                              ShowtimeRepository showtimeRepository,
                              SeatRepository seatRepository,
                              AdminSecurityService adminSecurityService) {
        this.reservationRepository = reservationRepository;
        this.reservationSeatRepository = reservationSeatRepository;
        this.userRepository = userRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.adminSecurityService = adminSecurityService;
    }

    public ReservationResponse createReservation(String userEmail, ReservationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        for (Long seatId : request.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));

            if (!seat.getRoom().getId().equals(showtime.getRoom().getId())) {
                throw new RuntimeException("Seat does not belong to the same room as the showtime");
            }

            boolean alreadyBooked = reservationSeatRepository
                    .existsBySeatIdAndReservationShowtimeIdAndReservationStatus(
                            seatId,
                            showtime.getId(),
                            "BOOKED"
                    );

            if (alreadyBooked) {
                throw new RuntimeException("One or more seats are already booked");
            }
        }

        Reservation reservation = new Reservation();
        reservation.setReservationTime(LocalDateTime.now());
        reservation.setStatus("BOOKED");
        reservation.setUser(user);
        reservation.setShowtime(showtime);

        Reservation savedReservation = reservationRepository.save(reservation);

        for (Long seatId : request.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));

            ReservationSeat reservationSeat = new ReservationSeat();
            reservationSeat.setReservation(savedReservation);
            reservationSeat.setSeat(seat);

            reservationSeatRepository.save(reservationSeat);
        }

        return buildReservationResponse(savedReservation);
    }

    public List<ReservationResponse> getMyReservations(String userEmail) {
        List<Reservation> reservations = reservationRepository.findByUserEmail(userEmail);
        List<ReservationResponse> responses = new ArrayList<>();

        for (Reservation reservation : reservations) {
            responses.add(buildReservationResponse(reservation));
        }

        return responses;
    }

    public List<Long> getBookedSeatIdsByShowtimeId(Long showtimeId) {
        return reservationSeatRepository.findBookedSeatIdsByShowtimeId(showtimeId);
    }

    public void cancelReservation(Long reservationId, String userEmail) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        boolean isAdmin = adminSecurityService.isAdmin(userEmail);
        boolean isOwner = reservation.getUser() != null
                && reservation.getUser().getEmail().equalsIgnoreCase(userEmail);

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException("You can only cancel your own reservation");
        }

        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
    }

    public List<ReservationResponse> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();

        return reservations.stream()
                .map(this::buildReservationResponse)
                .toList();
    }

    private ReservationResponse buildReservationResponse(Reservation reservation) {
        List<ReservationSeat> reservationSeats =
                reservationSeatRepository.findByReservationId(reservation.getId());

        List<String> seatLabels = new ArrayList<>();
        for (ReservationSeat reservationSeat : reservationSeats) {
            Seat seat = reservationSeat.getSeat();
            String label = seat.getRowLabel() + seat.getSeatNumber();
            seatLabels.add(label);
        }

        ReservationResponse response = new ReservationResponse();
        response.setReservationId(reservation.getId());
        response.setStatus(reservation.getStatus());
        response.setReservationTime(reservation.getReservationTime().toString());
        response.setMovieTitle(reservation.getShowtime().getMovie().getTitle());
        response.setRoomName(reservation.getShowtime().getRoom().getName());
        response.setShowtimeStart(reservation.getShowtime().getStartTime().toString());
        response.setShowtimeEnd(reservation.getShowtime().getEndTime().toString());
        response.setSeatLabels(seatLabels);

        if (reservation.getUser() != null) {
            response.setUserFullName(reservation.getUser().getFullName());
            response.setUserEmail(reservation.getUser().getEmail());
        }

        return response;
    }
}