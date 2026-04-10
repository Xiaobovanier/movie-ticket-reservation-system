package com.xiaobo.movieticketsystem.dto;

import java.util.List;

public class ReservationResponse {

    private Long reservationId;
    private String status;
    private String reservationTime;
    private String movieTitle;
    private String roomName;
    private String showtimeStart;
    private String showtimeEnd;
    private List<String> seatLabels;

    private String userFullName;
    private String userEmail;

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReservationTime() {
        return reservationTime;
    }

    public void setReservationTime(String reservationTime) {
        this.reservationTime = reservationTime;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getShowtimeStart() {
        return showtimeStart;
    }

    public void setShowtimeStart(String showtimeStart) {
        this.showtimeStart = showtimeStart;
    }

    public String getShowtimeEnd() {
        return showtimeEnd;
    }

    public void setShowtimeEnd(String showtimeEnd) {
        this.showtimeEnd = showtimeEnd;
    }

    public List<String> getSeatLabels() {
        return seatLabels;
    }

    public void setSeatLabels(List<String> seatLabels) {
        this.seatLabels = seatLabels;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}