package com.travelapp.travelplanner.favorites.dto;

import com.travelapp.travelplanner.destination.model.Destination;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FavoriteResponse {
    private Long id;
    private Destination destination;
}
