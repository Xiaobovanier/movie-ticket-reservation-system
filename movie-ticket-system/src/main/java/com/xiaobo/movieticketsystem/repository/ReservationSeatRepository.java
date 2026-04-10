package com.xiaobo.movieticketsystem.repository;

import com.xiaobo.movieticketsystem.entity.ReservationSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationSeatRepository extends JpaRepository<ReservationSeat, Long> {

    boolean existsBySeatIdAndReservationShowtimeIdAndReservationStatus(
            Long seatId,
            Long showtimeId,
            String status
    );

    List<ReservationSeat> findByReservationId(Long reservationId);

    @Query("""
            select rs.seat.id
            from ReservationSeat rs
            where rs.reservation.showtime.id = :showtimeId
            and rs.reservation.status = 'BOOKED'
            """)
    List<Long> findBookedSeatIdsByShowtimeId(Long showtimeId);
}