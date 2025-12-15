package com.travelapp.travelplanner.booking.service;

import com.travelapp.travelplanner.booking.dto.BookingRequest;
import com.travelapp.travelplanner.booking.dto.BookingResponse;
import com.travelapp.travelplanner.booking.model.Booking;
import com.travelapp.travelplanner.booking.model.BookingStatus;
import com.travelapp.travelplanner.booking.repository.BookingRepository;
import com.travelapp.travelplanner.destination.model.Destination;
import com.travelapp.travelplanner.destination.repository.DestinationRepository;
import com.travelapp.travelplanner.exceptions.BadRequestException;
import com.travelapp.travelplanner.exceptions.ResourceNotFoundException;
import com.travelapp.travelplanner.user.model.User;
import com.travelapp.travelplanner.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          DestinationRepository destinationRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
    }

    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        if (request.getDestinationId() == null) {
            throw new BadRequestException("destinationId is required");
        }
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new BadRequestException("startDate and endDate are required");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("startDate must be before endDate");
        }
        if (request.getTravelers() == null || request.getTravelers() <= 0) {
            throw new BadRequestException("travelers must be > 0");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));

        Booking booking = Booking.builder()
                .user(user)
                .destination(destination)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelers(request.getTravelers())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUser_Id(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getUserBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You cannot access someone else's booking");
        }

        return toResponse(booking);
    }

    @Transactional
    public void cancelBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You cannot cancel someone else's booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getDestination(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getTravelers(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
    }
}
