export interface MembershipDTO {
  userId: number;
  userName: string;
  userLastname: string;
  userEmail: string;
  clubId: number;
  clubName: string;
  status: string;
  profileImage: string;
  joinedAt: string; // ISO format
}
