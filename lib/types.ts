// ─── Shared types for BusGO API responses ────────────────────────────────────

export interface RouteInfo {
  id?: string;
  origin: string;
  destination: string;
  departureAt: string; // ISO string from JSON
  arrivalAt: string;
  price: number;
}

export interface BusSearchResult {
  id: string;
  name: string;
  number: string;
  totalSeats: number;
  availableSeats: number;
  route: RouteInfo;
}

export interface Seat {
  id: string;
  seatNumber: string;
  isBooked: boolean;
}

export interface BusWithSeats {
  id: string;
  name: string;
  number: string;
  totalSeats: number;
  route: RouteInfo;
  seats: Seat[];
}
