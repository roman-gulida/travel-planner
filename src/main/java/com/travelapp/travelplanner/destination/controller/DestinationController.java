package com.travelapp.travelplanner.destination.controller;

import com.travelapp.travelplanner.destination.model.Destination;
import com.travelapp.travelplanner.destination.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    // PUBLIC or AUTHENTICATED? Right now: any authenticated user.
    @GetMapping
    public ResponseEntity<List<Destination>> getAll() {
        List<Destination> list = destinationService.getAllDestinations();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getById(@PathVariable Long id) {
        Destination dest = destinationService.getDestination(id);
        return ResponseEntity.ok(dest);
    }

    // ADMIN ONLY ENDPOINTS
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Destination> create(@RequestBody Destination destination) {
        Destination created = destinationService.createDestination(destination);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Destination> update(@PathVariable Long id,
                                              @RequestBody Destination destination) {
        Destination updated = destinationService.updateDestination(id, destination);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }
}
