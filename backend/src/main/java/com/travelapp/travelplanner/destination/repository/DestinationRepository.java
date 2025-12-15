package com.travelapp.travelplanner.destination.repository;

import com.travelapp.travelplanner.destination.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
}
