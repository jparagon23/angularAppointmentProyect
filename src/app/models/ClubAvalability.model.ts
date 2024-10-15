export interface ClubAvailability {
  alwaysAvailable?: boolean;
  noAvailability?: boolean;
  byRange?: boolean;
  initialDate?: string; // Optional, only present if the club has availability set for specific dates
  endDate?: string; // Optional
}
