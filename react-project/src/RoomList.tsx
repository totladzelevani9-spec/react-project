import PropTypes from "prop-types";
import RoomCard from "./RoomCard";
import type { Room } from "./types";

interface RoomListProps {
  rooms: Room[];
  onBook: (room: Room) => void;
}

function RoomList({ rooms, onBook }: RoomListProps) {
  if (rooms.length === 0) {
    return <p className="empty">არჩეული ფილტრებით ოთახი ვერ მოიძებნა.</p>;
  }

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onBook={onBook} />
      ))}
    </div>
  );
}

RoomList.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      capacity: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      status: PropTypes.oneOf(["Available", "Occupied"]).isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onBook: PropTypes.func.isRequired,
};

export default RoomList;
