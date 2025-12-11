package com.travelapp.travelplanner.favorites.service;

import com.travelapp.travelplanner.destination.model.Destination;
import com.travelapp.travelplanner.destination.repository.DestinationRepository;
import com.travelapp.travelplanner.exceptions.BadRequestException;
import com.travelapp.travelplanner.exceptions.ResourceNotFoundException;
import com.travelapp.travelplanner.favorites.dto.FavoriteRequest;
import com.travelapp.travelplanner.favorites.dto.FavoriteResponse;
import com.travelapp.travelplanner.favorites.model.Favorite;
import com.travelapp.travelplanner.favorites.repository.FavoritesRepository;
import com.travelapp.travelplanner.user.model.User;
import com.travelapp.travelplanner.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoritesService {

    private final FavoritesRepository favoritesRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public FavoritesService(FavoritesRepository favoriteRepository,
                            UserRepository userRepository,
                            DestinationRepository destinationRepository) {
        this.favoritesRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
    }

    @Transactional
    public FavoriteResponse addFavorite(Long userId, FavoriteRequest request) {
        Long destId = request.getDestinationId();

        if (destId == null) {
            throw new BadRequestException("destinationId is required");
        }

        if (favoritesRepository.existsByUser_IdAndDestination_Id(userId, destId)) {
            throw new BadRequestException("Destination already in favorites");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Destination destination = destinationRepository.findById(destId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));

        Favorite favorite = Favorite.builder()
                .user(user)
                .destination(destination)
                .build();

        Favorite saved = favoritesRepository.save(favorite);
        return new FavoriteResponse(saved.getId(), saved.getDestination());
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(Long userId) {
        return favoritesRepository.findByUser_Id(userId).stream()
                .map(fav -> new FavoriteResponse(fav.getId(), fav.getDestination()))
                .toList();
    }

    @Transactional
    public void removeFavorite(Long userId, Long favoriteId) {
        Favorite favorite = favoritesRepository.findById(favoriteId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));

        if (!favorite.getUser().getId().equals(userId)) {
            throw new BadRequestException("You cannot delete someone else's favorite");
        }

        favoritesRepository.delete(favorite);
    }

    @Transactional
    public void removeFavoriteByDestination(Long userId, Long destinationId) {
        Favorite favorite = favoritesRepository
                .findByUser_IdAndDestination_Id(userId, destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        favoritesRepository.delete(favorite);
    }
}
