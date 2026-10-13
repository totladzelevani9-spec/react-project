export type RoomStatus = "Available" | "Occupied";

export interface Room {
  id: number;
  name: string;
  price: number; // ღამის ფასი ($)
  capacity: number; // სტუმრების მაქსიმალური რაოდენობა
  rating: number; // 0 - 5
  status: RoomStatus;
  image: string;
}
