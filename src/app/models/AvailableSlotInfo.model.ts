export interface AvailableSlotInfo {
  initialDateTime: string;
  endDateTime: string;
  club: String;
  courtType: String;
}

export interface DateInfo {
  initialDateTime: string;
  endDateTime: string;
  times: number;
}

export interface AvailableSlot {
  date: DateInfo;
}

export interface AvailableSlotsResponse {
  availableSlots: AvailableSlot[];
}
