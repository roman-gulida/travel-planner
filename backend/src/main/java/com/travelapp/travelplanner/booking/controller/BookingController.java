package com.travelapp.travelplanner.booking.controller;

import com.travelapp.travelplanner.booking.dto.BookingRequest;
import com.travelapp.travelplanner.booking.dto.BookingResponse;
import com.travelapp.travelplanner.booking.model.BookingStatus;
import com.travelapp.travelplanner.booking.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        Object attr = request.getAttribute("userId");
        if (attr instanceof Long id) {
            return id;
        }
        throw new IllegalStateException("User ID not found in request. Is JWT filter configured?");
    }

    // USER: create booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request,
                                                         HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        BookingResponse created = bookingService.createBooking(userId, request);
        return ResponseEntity.ok(created);
    }

    // USER: list own bookings
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getMyBookings(HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        List<BookingResponse> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    // USER: get single booking
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getMyBooking(@PathVariable Long id,
                                                        HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        BookingResponse booking = bookingService.getUserBooking(userId, id);
        return ResponseEntity.ok(booking);
    }

    // USER: cancel own booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id,
                                              HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        bookingService.cancelBooking(userId, id);
        return ResponseEntity.noContent().build();
    }

    // ADMIN: view all bookings
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<List<BookingResponse>> getAll() {
        List<BookingResponse> all = bookingService.getAllBookings();
        return ResponseEntity.ok(all);
    }

    // ADMIN: update status
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable Long id,
                                                        @RequestParam BookingStatus status) {
        BookingResponse updated = bookingService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
