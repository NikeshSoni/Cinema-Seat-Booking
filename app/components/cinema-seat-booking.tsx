"use client";
import React, { useMemo, useState } from "react";
import {
  Ticket,
  CreditCard,
  MapPin,
  CheckCircle,
  Users,
  TrendingUp,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Armchair,
  Crown,
  Star,
  Info,
} from "lucide-react";

interface Seat {
  id: string;
  row: number;
  seat: number;
  type: string;
  price: number;
  color: string;
  status: string;
  selected: boolean;
}

interface CinemaBeatBookingProps {
  layout?: {
    rows: number;
    seatsPerRow: number;
    aislePosition: number;
  };
  seatType?: {
    [key: string]: {
      name: string;
      price: number;
      rows: number[];
    };
  };
  bookedSeat?: string[];
  currancy?: string;
  title?: string;
  subtitle?: string;
}

const CinemaBeatBooking = ({
  layout = {
    rows: 8,
    seatsPerRow: 12,
    aislePosition: 5,
  },
  seatType = {
    regular: {
      name: "Regular",
      price: 150,
      rows: [0, 1, 2],
    },
    premium: {
      name: "Premium",
      price: 250,
      rows: [3, 4, 5],
    },
    vip: {
      name: "VIP",
      price: 350,
      rows: [6, 7, 8],
    },
  },
  bookedSeat = [],
  currancy = "₹",
  title = "Cinema Hall Booking",
  subtitle = "Select your favorite seat",
}: CinemaBeatBookingProps) => {
  const colors = ["purple", "blue", "amber", "emerald", "rose", "indigo", "pink", "gray"];

  const colorMap = {
    blue: "from-blue-500 to-blue-600 border-blue-700",
    purple: "from-purple-500 to-purple-600 border-purple-700",
    amber: "from-amber-500 to-amber-600 border-amber-700",
    emerald: "from-emerald-500 to-emerald-600 border-emerald-700",
    rose: "from-rose-500 to-rose-600 border-rose-700",
    indigo: "from-indigo-500 to-indigo-600 border-indigo-700",
    pink: "from-pink-500 to-pink-600 border-pink-700",
    gray: "from-gray-500 to-gray-600 border-gray-700",
  };

  const getSeatType = (row: number) => {
    const seatTypeEntries = Object.entries(seatType);
    for (let i = 0; i < seatTypeEntries.length; i++) {
      const [type, config] = seatTypeEntries[i] as [string, any];
      if (config.rows.includes(row)) {
        const color = colors[i % colors.length];
        return {
          type,
          color,
          ...config,
        };
      }
    }
    const [firstType, firstConfig] = Object.entries(seatType)[0] as [string, any];
    return {
      type: firstType,
      color: colors[0],
      ...firstConfig,
    };
  };

  const initializeSeats = useMemo(() => {
    const seats = [];
    for (let row = 0; row < layout.rows; row++) {
      const seatsRow = [];
      const seatTypeInfo = getSeatType(row);
      for (let seat = 0; seat < layout.seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        seatsRow.push({
          id: seatId,
          row,
          seat,
          type: seatTypeInfo?.type || "regular",
          price: seatTypeInfo?.price || 150,
          color: seatTypeInfo?.color || "blue",
          status: bookedSeat?.includes(seatId) ? "booked" : "available",
          selected: false,
        });
      }
      seats.push(seatsRow);
    }
    return seats;
  }, [layout, bookedSeat]);

  const [seats, setSeats] = useState(initializeSeats);
  const [selectedSeat, setSelectedSeat] = useState<Seat[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const getSeatClassname = (seat: any, isHovered: boolean) => {
    const baseClass = "relative w-9 h-9 sm:w-11 sm:h-11 lg:w-13 lg:h-13 m-1 rounded-t-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md transform";
    
    if (seat.status === "booked") {
      return `${baseClass} bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500 text-gray-500 cursor-not-allowed opacity-60`;
    }
    
    if (seat.selected) {
      return `${baseClass} bg-gradient-to-br from-green-500 to-emerald-600 border-green-700 text-white scale-105 shadow-lg shadow-green-200`;
    }
    
    if (isHovered) {
      return `${baseClass} bg-gradient-to-br ${colorMap[seat.color as keyof typeof colorMap]} text-white scale-105 shadow-xl`;
    }
    
    return `${baseClass} bg-gradient-to-br ${colorMap[seat.color as keyof typeof colorMap]} text-white hover:scale-105 hover:shadow-xl transition-all`;
  };

  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    const seat = seats[rowIndex][seatIndex];
    if (seat.status === "booked") return;
    const isCurrentlySelected = seat.selected;
    
    setSeats((prevSeats: Seat[][]) => {
      return prevSeats.map((row, rIdx) =>
        row.map((s, sIdx) => {
          if (rIdx === rowIndex && sIdx === seatIndex) {
            return { ...s, selected: !s.selected };
          }
          return s;
        })
      );
    });
    
    if (isCurrentlySelected) {
      setSelectedSeat((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeat((prev) => [...prev, seat]);
    }
  };

  const renderSeatSection = (seatRow: any, startIndex: any, endIndex: any) => {
    return (
      <div className="flex gap-1">
        {seatRow.slice(startIndex, endIndex).map((seat: any, index: any) => {
          const seatId = `${seat.row}-${startIndex + index}`;
          const isHovered = hoveredSeat === seatId;
          return (
            <button
              key={seat.id}
              className={getSeatClassname(seat, isHovered)}
              title={`${seat.id} - ${getSeatType(seat.row)?.name || "Regular"} - ${currancy}${seat.price}`}
              onClick={() => handleSeatClick(seat.row, startIndex + index)}
              onMouseEnter={() => setHoveredSeat(seatId)}
              onMouseLeave={() => setHoveredSeat(null)}
              disabled={seat.status === "booked"}
            >
              <span className="relative z-10">{startIndex + index + 1}</span>
              {seat.selected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const uniqueSeatType = Object.entries(seatType).map(([type, config], index) => ({
    type,
    color: colors[index % colors.length],
    ...config,
  }));

  const getTotalPrice = () => {
    return selectedSeat.reduce((total, seat) => total + seat.price, 0);
  };

  const handleBooking = () => {
    if (selectedSeat.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    
    const bookingData = {
      seats: selectedSeat,
      totalPrice: getTotalPrice(),
      seatIds: selectedSeat.map((s) => s.id),
    };
    
    console.log("Booking complete:", bookingData);
    
    setSeats((prevSeats) =>
      prevSeats.map((row) =>
        row.map((seat) =>
          selectedSeat.some((s) => s.id === seat.id)
            ? { ...seat, status: "booked", selected: false }
            : seat
        )
      )
    );
    
    setSelectedSeat([]);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const clearSelection = () => {
    setSeats((prevSeats) =>
      prevSeats.map((row) =>
        row.map((seat) => ({ ...seat, selected: false }))
      )
    );
    setSelectedSeat([]);
  };

  const getSeatTypeIcon = (type: string) => {
    switch (type) {
      case "vip": return <Crown className="w-4 h-4" />;
      case "premium": return <Star className="w-4 h-4" />;
      default: return <Armchair className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 transform transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Screen 1 | Dolby Atmos</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">{layout.rows * layout.seatsPerRow} Seats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Section */}
        <div className="mb-12 relative">
          <div className="absolute inset-x-0 -top-6 flex justify-center z-10">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
              <Film className="w-4 h-4" />
              SCREEN
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-3 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full" />
            <div className="w-full h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-3xl shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Seat Map Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 overflow-x-auto">
          <div className="flex flex-col items-center min-w-max">
            {seats.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center mb-3 group">
                <div className="w-10 text-center font-bold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mr-4">
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                {renderSeatSection(row, 0, layout.aislePosition)}
                <div className="w-8 md:w-10 flex justify-center">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full" />
                </div>
                {renderSeatSection(row, layout.aislePosition, layout.seatsPerRow)}
              </div>
            ))}
          </div>
        </div>

        {/* Legend Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-center gap-8">
            {uniqueSeatType.map((seatType) => (
              <div key={seatType.type} className="flex items-center gap-3 group cursor-pointer">
                <div className={`
                  w-10 h-10 rounded-t-xl 
                  bg-gradient-to-br 
                  ${colorMap[seatType.color as keyof typeof colorMap]}
                  shadow-md group-hover:shadow-lg transition-all
                  flex items-center justify-center
                `}>
                  {getSeatTypeIcon(seatType.type)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize flex items-center gap-1">
                    {seatType.name}
                    {seatType.type === "vip" && <Crown className="w-3 h-3 text-amber-500" />}
                  </p>
                  <p className="text-sm text-gray-500">{currancy}{seatType.price}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-t-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-800">Selected</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-t-xl bg-gradient-to-br from-gray-300 to-gray-400 shadow-md flex items-center justify-center">
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
              <p className="font-semibold text-gray-800">Booked</p>
            </div>
          </div>
        </div>

        {/* Booking Summary Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-md">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Booking Summary</h3>
            </div>
            {selectedSeat.length > 0 && (
              <button
                onClick={clearSelection}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          
          {selectedSeat.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <Armchair className="w-4 h-4" />
                  Selected Seats:
                </span>
                <div className="flex flex-wrap gap-2 justify-end">
                  {selectedSeat.map((s) => (
                    <span key={s.id} className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg text-sm">
                      {s.id}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Seats:
                </span>
                <span className="font-semibold text-gray-800 text-lg">{selectedSeat.length}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Total Amount:
                </span>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {currancy}{getTotalPrice()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Armchair className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No seats selected yet</p>
              <p className="text-sm text-gray-300 mt-1">Click on any available seat to book</p>
            </div>
          )}
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={selectedSeat.length === 0}
          className={`
            w-full py-4 px-6 rounded-xl font-bold text-lg 
            transition-all duration-300 transform
            flex items-center justify-center gap-3
            ${selectedSeat.length > 0
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {selectedSeat.length > 0 ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Book {selectedSeat.length} Seat{selectedSeat.length > 1 ? 's' : ''} - {currancy}{getTotalPrice()}</span>
            </>
          ) : (
            <>
              <Info className="w-5 h-5" />
              <span>Select Seats to Continue</span>
            </>
          )}
        </button>

        {/* Success Toast Notification */}
        {showConfirmation && (
          <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-bold">Booking Confirmed!</p>
                <p className="text-sm opacity-90">{selectedSeat.length} seat(s) booked successfully</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Add missing Film component
const Film = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

export default CinemaBeatBooking;