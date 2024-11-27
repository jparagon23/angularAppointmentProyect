export interface AvailableSlotInfo {
  initialDateTime: string;
  endDateTime: string;
  club: String;
  courtType: String;
}

export interface DateInfo {
  initialDateTime: string;
  endDateTime: string;
  availableCourts: string[];
}

export interface AvailableSlot {
  date: DateInfo;
}

export interface AvailableSlotsResponse {
  availableSlots: AvailableSlot[];
}
