import { useEffect, useMemo, useRef, useState } from "react";
import { useFetchRooms } from "./useFetchRooms";
import RoomList from "./RoomList";
import type { Room } from "./types";
import "./styles.css";

type SortBy = "price" | "rating";

const MAX_PRICE = 600;

export default function App() {
  const { rooms, loading, error } = useFetchRooms("/rooms.json");

  // ფილტრის პარამეტრები
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE);
  const [minCapacity, setMinCapacity] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortBy>("price");
  const [booked, setBooked] = useState<Room | null>(null);

  // ფასის სლაიდერის DOM ელემენტი
  const sliderRef = useRef<HTMLInputElement>(null);

  // useRef: სლაიდერის შევსების ზოლი DOM-ის პირდაპირ მართვით
  useEffect(() => {
    if (sliderRef.current) {
      const percent = (maxPrice / MAX_PRICE) * 100;
      sliderRef.current.style.setProperty("--fill", `${percent}%`);
    }
  }, [maxPrice]);

  // useMemo: გაფილტვრა + დალაგება (ფასი ან რეიტინგი)
  const visibleRooms = useMemo(() => {
    const filtered = rooms.filter(
      (r) => r.price <= maxPrice && r.capacity >= minCapacity
    );
    return [...filtered].sort((a, b) =>
      sortBy === "price" ? a.price - b.price : b.rating - a.rating
    );
  }, [rooms, maxPrice, minCapacity, sortBy]);

  const handleBook = (room: Room) => setBooked(room);

  const resetFilters = () => {
    setMaxPrice(MAX_PRICE);
    setMinCapacity(1);
    setSortBy("price");
    sliderRef.current?.focus(); // ref-ით ფოკუსი სლაიდერზე
  };

  return (
    <div className="container">
      <h1>🏨 სასტუმროს ოთახები</h1>

      <section className="filters">
        <label>
          მაქს. ფასი: <strong>${maxPrice}</strong>
          <input
            ref={sliderRef}
            type="range"
            min={50}
            max={MAX_PRICE}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </label>

        <label>
          მინ. ტევადობა:
          <select
            value={minCapacity}
            onChange={(e) => setMinCapacity(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </label>

        <label>
          დალაგება:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="price">ფასი (ზრდადობით)</option>
            <option value="rating">რეიტინგი (კლებადობით)</option>
          </select>
        </label>

        <button className="btn btn--ghost" onClick={resetFilters}>
          გასუფთავება
        </button>
      </section>

      {booked && (
        <div className="notice">
          ✅ დაჯავშნილია: <strong>{booked.name}</strong> (${booked.price} / ღამე)
          <button onClick={() => setBooked(null)}>✕</button>
        </div>
      )}

      {loading && <p>იტვირთება...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <RoomList rooms={visibleRooms} onBook={handleBook} />
      )}
    </div>
  );
}
