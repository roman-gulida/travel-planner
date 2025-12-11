package com.travelapp.travelplanner.favorites.repository;

import com.travelapp.travelplanner.favorites.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritesRepository extends JpaRepository<Favorite, Long> {

    // All favorites for a given user
    List<Favorite> findByUser_Id(Long userId);

    // Check if a favorite already exists
    boolean existsByUser_IdAndDestination_Id(Long userId, Long destinationId);

    // For deleting by user and destination (if you want)
    Optional<Favorite> findByUser_IdAndDestination_Id(Long userId, Long destinationId);
}
