import { useState } from 'react';
import { BookingForm } from './components/BookingForm';
import { DiscountProvider, useDiscount } from './context/DiscountContext';
import type { BookingSummary } from './types/booking';

function StudentToggle() {
  const { isStudent, setIsStudent } = useDiscount();
  return (
    <label className="toggle">
      <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} />
      სტუდენტური ფასდაკლება (−15%)
    </label>
  );
}

function Confirmation({ booking, onClose }: { booking: BookingSummary; onClose: () => void }) {
  const { room, values, services, price } = booking;
  return (
    <div className="confirmation" role="status">
      <h2>ჯავშანი წარმატებით შესრულდა!</h2>
      <p>{room.name}, {values.checkIn} — {values.checkOut} ({price.nights} ღამე)</p>
      <p>სტუმრების რაოდენობა: {values.guests}</p>
      <p>სერვისები: {services.length ? services.map((s) => s.name).join(', ') : 'არ არის არჩეული'}</p>
      <p><strong>ჯამური ღირებულება: {price.total.toFixed(2)} ₾</strong></p>
      <button className="btn" onClick={onClose}>ახალი ჯავშანი</button>
    </div>
  );
}

export default function App() {
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  return (
    <DiscountProvider>
      <header className="header">
        <h1>სასტუმროს დაჯავშნა</h1>
        <StudentToggle />
      </header>
      <main className="container">
        {booking ? (
          <Confirmation booking={booking} onClose={() => setBooking(null)} />
        ) : (
          <BookingForm onBooked={setBooking} />
        )}
      </main>
    </DiscountProvider>
  );
}
