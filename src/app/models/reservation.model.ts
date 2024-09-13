export interface AvailableSlot {
  date: {
    dateTime: string;
    times: number;
  };
}

export interface AvailableSlotsResponse {
  availableSlots: AvailableSlot[];
}
