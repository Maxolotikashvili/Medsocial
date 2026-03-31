import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface ReviewResponse {
    id: string,
    point: number,
    text: string
}

export interface Rating {
    point: string,
    reviews: number
}

export interface Review {
    point: number,
    text: string
}

export interface RatingIcons {
    selected: IconDefinition,
    nonSelected: IconDefinition
}

export type RatingValue = 0 | 1 | 2 | 3 | 4 | 5;
export type RatingType = 'readonly' | 'write';