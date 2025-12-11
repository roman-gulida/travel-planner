package com.travelapp.travelplanner.booking.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {

    private Long destinationId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer travelers;
}
