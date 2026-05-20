import CinemaBeatBooking from "./components/cinema-seat-booking";

export default function Home() {
  return (
    <div className="">
      <CinemaBeatBooking layout={
        {
          rows: 8,
          seatsPerRow: 12,
          aislePosition: 5
        }
      }
        seatType={{
          regular: {
            name: "Regular",
            price: 150,
            rows: [0, 1, 2]
          },
          premium: {
            name: "Premium",
            price: 250,
            rows: [3, 4, 5]
          },
          vip: {
            name: "VIP",
            price: 350,
            rows: [6, 7, 8]
          }
        }}
        bookedSeat={["C2", "C4"]}
      />
    </div>
  );
}
