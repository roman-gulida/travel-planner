package com.travelapp.travelplanner.favorites.controller;

import com.travelapp.travelplanner.favorites.dto.FavoriteRequest;
import com.travelapp.travelplanner.favorites.dto.FavoriteResponse;
import com.travelapp.travelplanner.favorites.service.FavoritesService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoritesController {

    private final FavoritesService favoritesService;

    public FavoritesController(FavoritesService favoriteService) {
        this.favoritesService = favoriteService;
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        Object attr = request.getAttribute("userId");
        if (attr instanceof Long id) {
            return id;
        }
        throw new IllegalStateException("User ID not found in request. Is JWT filter configured?");
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<FavoriteResponse> favorites = favoritesService.getFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping
    public ResponseEntity<FavoriteResponse> addFavorite(@RequestBody FavoriteRequest body,
                                                        HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        FavoriteResponse created = favoritesService.addFavorite(userId, body);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<Void> deleteFavorite(@PathVariable Long favoriteId,
                                               HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        favoritesService.removeFavorite(userId, favoriteId);
        return ResponseEntity.noContent().build();
    }

    // Optional: delete by destination id instead of favorite id
    @DeleteMapping("/by-destination/{destinationId}")
    public ResponseEntity<Void> deleteFavoriteByDestination(@PathVariable Long destinationId,
                                                            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        favoritesService.removeFavoriteByDestination(userId, destinationId);
        return ResponseEntity.noContent().build();
    }
}
