package com.travelapp.travelplanner.booking.dto;

import com.travelapp.travelplanner.booking.model.BookingStatus;
import com.travelapp.travelplanner.destination.model.Destination;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Destination destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer travelers;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
