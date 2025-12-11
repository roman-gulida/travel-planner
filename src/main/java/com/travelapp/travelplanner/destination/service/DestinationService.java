package com.travelapp.travelplanner.destination.service;

import com.travelapp.travelplanner.destination.model.Destination;
import com.travelapp.travelplanner.destination.repository.DestinationRepository;
import com.travelapp.travelplanner.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestination(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id " + id));
    }

    public Destination createDestination(Destination destination) {
        destination.setId(null);
        return destinationRepository.save(destination);
    }

    public Destination updateDestination(Long id, Destination updated) {
        Destination existing = getDestination(id);

        existing.setName(updated.getName());
        existing.setCountry(updated.getCountry());
        existing.setCity(updated.getCity());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        existing.setPrice(updated.getPrice());

        return destinationRepository.save(existing);
    }

    public void deleteDestination(Long id) {
        Destination existing = getDestination(id);
        destinationRepository.delete(existing);
    }
}
