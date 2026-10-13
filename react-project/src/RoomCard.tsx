import PropTypes from "prop-types";
import type { Room } from "./types";

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
}

function RoomCard({ room, onBook }: RoomCardProps) {
  const isAvailable = room.status === "Available";

  return (
    <article className={`room-card ${isAvailable ? "" : "room-card--occupied"}`}>
      <img src={room.image} alt={room.name} className="room-card__img" />
      <div className="room-card__body">
        <h3>{room.name}</h3>
        <p>👥 ტევადობა: {room.capacity}</p>
        <p>⭐ რეიტინგი: {room.rating.toFixed(1)}</p>
        <p className="room-card__price">${room.price} / ღამე</p>

        {/* პირობითი რენდერინგი სტატუსის მიხედვით */}
        {isAvailable ? (
          <span className="badge badge--available">Available</span>
        ) : (
          <span className="badge badge--occupied">Occupied</span>
        )}

        <button
          className="btn"
          disabled={!isAvailable}
          onClick={() => onBook(room)}
        >
          {isAvailable ? "დაჯავშნა" : "მიუწვდომელია"}
        </button>
      </div>
    </article>
  );
}

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    capacity: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    status: PropTypes.oneOf(["Available", "Occupied"]).isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onBook: PropTypes.func.isRequired,
};

export default RoomCard;
