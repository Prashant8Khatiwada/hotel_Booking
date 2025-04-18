import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { SchedulerGrid } from "./SchdulerGrid";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Reservation } from "./useCalenderGrid";
import { ReservationForm } from "./ReservationForm";
import { RoomPopover } from "./RoomPopover";

interface Icon {
  name: string;
  src: string;
}

interface Room {
  id: string;
  number: string;
  name?: string;
  isExpanded: boolean;
  icon?: Icon[];
}

interface RoomCategory {
  id: string;
  name: string;
  rooms: Room[];
  isExpanded: boolean;
}

const initialCategories: RoomCategory[] = [
  {
    id: "standard",
    name: "Standard",
    isExpanded: true,
    rooms: [
      {
        id: "bandipur",
        number: "",
        name: "Bandipur Room 123",
        isExpanded: true,
        icon: [
          { name: "Smoking", src: "smoke" },
          { name: "House Keeping", src: "HouseKeeping" },
          { name: "Work Order", src: "WorkOrder" },
          { name: "Connected", src: "link" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "102",
        number: "102",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Work Order", src: "WorkOrder" },
          { name: "Connected", src: "link" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "103",
        number: "103",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Work Order", src: "WorkOrder" },
          { name: "Connected", src: "link" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "104",
        number: "104",
        isExpanded: true,
        icon: [
          { name: "Smoking", src: "Smoking" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "105",
        number: "105",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Clean", src: "Available" },
        ],
      },
    ],
  },
  {
    id: "double",
    name: "Double",
    isExpanded: false,
    rooms: [
      {
        id: "201",
        number: "201",
        isExpanded: true,
        icon: [
          { name: "Smoking", src: "Smoking" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "202",
        number: "202",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Clean", src: "Available" },
        ],
      },
    ],
  },
  {
    id: "suite",
    name: "Suite",
    isExpanded: false,
    rooms: [
      {
        id: "301",
        number: "301",
        isExpanded: true,
        icon: [
          { name: "Smoking", src: "Smoking" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "302",
        number: "302",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Clean", src: "Available" },
        ],
      },
    ],
  },
  {
    id: "prime-z",
    name: "Prime Z",
    isExpanded: false,
    rooms: [
      {
        id: "301",
        number: "301",
        isExpanded: true,
        icon: [
          { name: "Smoking", src: "Smoking" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "302",
        number: "302",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Clean", src: "Available" },
        ],
      },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    isExpanded: false,
    rooms: [
      {
        id: "301",
        number: "301",
        isExpanded: true,
        icon: [
          { name: "Smoking", src: "Smoking" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "302",
        number: "302",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Clean", src: "Available" },
        ],
      },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    isExpanded: false,
    rooms: [
      {
        id: "301",
        number: "301",
        isExpanded: true,
        icon: [
          { name: "Smoking", src: "Smoking" },
          { name: "Clean", src: "Available" },
        ],
      },
      {
        id: "302",
        number: "302",
        isExpanded: true,
        icon: [
          { name: "No Smoking", src: "NoSmoking" },
          { name: "Clean", src: "Available" },
        ],
      },
    ],
  },
];
interface DateFrame {
  frameDate: number;
}

export const ListRoom: React.FC<DateFrame> = ({ frameDate }) => {
  const [isReservationFormOpen, setIsReservationFormOpen] =
    useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "res-1742275687677",
      guestName: "Checked In",
      startDate: new Date("2025-04-11T18:15:00.000Z"),
      endDate: new Date("2025-04-16T18:15:00.000Z"),
      color: "bg-[#8bdd6b]",
      left: 87,
      top: 5,
      width: 263,
      height: 34,
      roomId: "102",
      roomType: "bandipur",
    },
  ]);

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate());
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isRoomPopoverOpen, setIsRoomPopoverOpen] = useState(false);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsRoomPopoverOpen(true);
  };

  const handleRoomKeyPress = (
    e: React.KeyboardEvent<HTMLDivElement>,
    room: Room
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRoomClick(room);
    }
  };

  const handleCategoryKeyPress = (
    e: React.KeyboardEvent<HTMLDivElement>,
    categoryId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCategory(categoryId);
    }
  };

  // Generate the date range based on the current start date and frameDate
  const generateDates = useCallback(() => {
    const dates = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < frameDate; i++) {
      dates.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, [frameDate, startDate]);

  const updateDates = useCallback(() => {
    const today = new Date();
    if (today.getDate()) {
      const newStartDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      setStartDate(newStartDate);
    }
  }, []);

  useEffect(() => {
    updateDates();
    const timer = setInterval(updateDates, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [updateDates]);

  // Function to navigate to previous period
  const goToPrevious = () => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - frameDate);
      return newDate;
    });
  };

  // Function to navigate to next period
  const goToNext = () => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + frameDate);
      return newDate;
    });
  };

  // Function to check if a date is the current date
  const isCurrentDate = useCallback((date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  // Function to format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const dates = generateDates();
  const currentMonth = new Date(startDate);
  const lastDate = dates[dates.length - 1].date;
  const showNextMonth = lastDate.getMonth() !== currentMonth.getMonth();
  const nextMonth = showNextMonth ? lastDate : null;

  // Room Types
  const [categories, setCategories] =
    useState<RoomCategory[]>(initialCategories);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const toggleCategory = (categoryId: string) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, isExpanded: !category.isExpanded }
          : category
      )
    );
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggingIndex(index);
    dragNode.current = e.target as HTMLDivElement;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDraggingIndex(index);
    }, 0);
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    if (draggingIndex !== null && draggingIndex !== targetIndex) {
      setCategories((oldCategories) => {
        const newCategories = [...oldCategories];
        const draggedItem = newCategories[draggingIndex];
        newCategories.splice(draggingIndex, 1);
        newCategories.splice(targetIndex, 0, draggedItem);
        setDraggingIndex(targetIndex);
        return newCategories;
      });
    }
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    if (dragNode.current) {
      dragNode.current.removeEventListener("dragend", handleDragEnd);
      dragNode.current = null;
    }
  };
  // Get all room IDs for cross-room drag and drop
  const allRoomIds = useCallback(() => {
    return categories.flatMap((category) =>
      category.rooms.map((room) => room.id)
    );
  }, [categories]);

  const handleReservationUpdate = (
    updatedReservations: Reservation[],
    roomId: string
  ) => {
    // Get the IDs of the updated reservations
    const updatedIds = updatedReservations.map((res) => res.id);

    // Keep all reservations that are not for this room or not in the updated list
    const otherReservations = reservations.filter(
      (res) => res.roomId !== roomId || !updatedIds.includes(res.id)
    );

    // Combine with the updated reservations
    const newReservations = [...otherReservations, ...updatedReservations];

    // Update the state with the new combined array
    setReservations(newReservations);

    // Log for debugging
    console.log("Updated reservations:", newReservations);
  };

  // Update the handleSaveReservation function to update positions based on dates
  const handleSaveReservation = (updatedReservation: Reservation) => {
    // Get the current reservations
    const currentReservations = [...reservations];

    // Find the index of the reservation to update
    const index = currentReservations.findIndex(
      (res) => res.id === updatedReservation.id
    );

    if (index !== -1) {
      // Update the reservation with the new data
      currentReservations[index] = {
        ...currentReservations[index],
        ...updatedReservation,
        // Make sure the dates are properly set
        startDate: new Date(updatedReservation.startDate),
        endDate: new Date(updatedReservation.endDate),
        color: updatedReservation.color,
      };

      // Update the state
      setReservations(currentReservations);
    } else {
      // This is a new reservation, add it to the array
      const newReservations = [...currentReservations, updatedReservation];
      setReservations(newReservations);
    }

    // Close the form
    setIsReservationFormOpen(false);
  };

  // Add this function to update the ReservationForm component with the correct dates
  const handleReservationFormOpen = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsReservationFormOpen(true);
  };
  const isReservationVisible = (
    reservation: Reservation,
    startDate: Date,
    frameDate: number
  ) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + frameDate - 1);

    return (
      (reservation.startDate >= startDate &&
        reservation.startDate <= endDate) ||
      (reservation.endDate >= startDate && reservation.endDate <= endDate) ||
      (reservation.startDate <= startDate && reservation.endDate >= endDate)
    );
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="w-[22rem] min-w-[280px] bg-gray-100 overflow-y-auto border-r border-gray-200">
          <div className="bg-white shadow-sm sticky top-0 z-10">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold" id="rooms-heading">
                Rooms
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Toggle room categories"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="divide-y divide-gray-200"
            role="tree"
            aria-labelledby="rooms-heading"
          >
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`${draggingIndex === index ? "opacity-50" : ""}`}
                role="treeitem"
                aria-expanded={category.isExpanded}
              >
                <div
                  className="flex items-center gap-1 pt-[16px] pb-[16px] pl-[22px] pr-[22px] h-[55px] border border-gray-100 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                  onKeyDown={(e) => handleCategoryKeyPress(e, category.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${category.name} category ${
                    category.isExpanded ? "expanded" : "collapsed"
                  }`}
                >
                  <div
                    className="text-gray-400 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <img
                      src={"/placeholder.svg"}
                      className="h-[18px] w-[10px] t-[16px] l-[22px]"
                    />
                  </div>
                  <p className="font-semibold">{category.name}</p>
                  <svg
                    className={`h-5 w-5 text-gray-500 ml-auto transition-transform ${
                      category.isExpanded ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {category.isExpanded && (
                  <div role="group">
                    {category.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-2 py-[10px] border border-gray-100 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-50"
                        onClick={() => handleRoomClick(room)}
                        onKeyDown={(e) => handleRoomKeyPress(e, room)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Room ${room.name || room.number}`}
                      >
                        <p className="text-sm font-[400] ml-4">
                          {room.name || room.number}
                        </p>
                        <div className="flex items-center gap-3">
                          {room.icon?.map((icon) => (
                            <img
                              src={icon.src || "/placeholder.svg"}
                              alt={icon.name}
                              className="h-[17px] w-[17px] opacity-90"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full min-w-[1068px] bg-white">
          <div className="w-full max-w-7xl mx-auto flex flex-col">
            <div className="flex justify-between items-center mb-[3px] pt-1">
              <button
                onClick={goToPrevious}
                className="p-1 ml-2"
                aria-label="Previous period"
              >
                <ChevronLeft className="h-6 w-6 font-semibold text-gray-[#1E1E1E]" />
              </button>

              <div className="flex-1 grid grid-cols-2 ml-4">
                <div className="text-[14px] text-[#1E1E1E] leading-[12.57px] font-medium">
                  {formatMonthYear(currentMonth)}
                </div>
                {nextMonth && (
                  <div className="text-[14px] text-[#1E1E1E] leading-[12.57px] font-medium text-center">
                    {formatMonthYear(nextMonth)}
                  </div>
                )}
              </div>

              <button
                onClick={goToNext}
                className="p-1"
                aria-label="Next period"
              >
                <ChevronRight className="h-6 w-6 font-semibold text-[#1E1E1E]" />
              </button>
            </div>

            <div
              className={`grid ${
                frameDate == 28 && "grid-cols-[repeat(28,minmax(36px,1fr))]"
              } ${
                frameDate == 21 && "grid-cols-[repeat(21,minmax(49px,1fr))]"
              } ${
                frameDate == 14 && "grid-cols-[repeat(14,minmax(72px,1fr))]"
              } gap-x-0 border-b`}
            >
              {dates.map((dateObj, index) => {
                const isToday = isCurrentDate(dateObj.date);
                return (
                  <div
                    key={index}
                    className={`relative border-t border-r flex flex-col items-center justify-center py-1`}
                    style={
                      isToday
                        ? {
                            background:
                              "radial-gradient(50% 112.3% at 50% 50%, rgba(22, 112, 181, 0.2) 0%, rgba(22, 112, 181, 0.7) 100%) ",
                          }
                        : {}
                    }
                  >
                    <div className="text-[10px] font-semibold text-[#1E1E1E]">
                      {dateObj.date
                        .toLocaleDateString("en-US", { weekday: "short" })
                        .slice(0, 3)}
                    </div>
                    <div
                      className={`text-[12px] font-semibold ${
                        dateObj.month === currentMonth.getMonth()
                          ? "text-gray-900"
                          : "text-gray-900"
                      }`}
                    >
                      {dateObj.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top "19" row */}
          <div
            className={`grid ${
              frameDate == 28 && "grid-cols-[repeat(28,minmax(36px,1fr))]"
            } ${frameDate == 21 && "grid-cols-[repeat(21,minmax(49px,1fr))]"} ${
              frameDate == 14 && "grid-cols-[repeat(14,minmax(72px,1fr))]"
            } mt-1`}
          >
            {Array(frameDate)
              .fill(0)
              .map((_, i) => (
                <div
                  className="flex items-center justify-center py-[12px]"
                  key={i}
                >
                  <div className="bg-[#67799766] rounded-sm text-[#1E1E1ECC] font-semibold text-center text-[10px] px-4 py-1">
                    19
                  </div>
                </div>
              ))}
          </div>
          {categories.map((category) => {
            return (
              <>
                <div
                  className={`grid ${
                    frameDate == 28 && "grid-cols-[repeat(28,1fr)]"
                  } ${frameDate == 21 && "grid-cols-[repeat(21,1fr)]"} ${
                    frameDate == 14 && "grid-cols-[repeat(14,1fr)]"
                  }`}
                  key={category.id}
                >
                  {Array(frameDate)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        className={`py-[17px] ${
                          frameDate == 28 && "pl-[8px] pr-[10px]"
                        } ${frameDate == 21 && "px-[10px]"}  ${
                          frameDate == 14 && "pl-[25px] pr-[22px]"
                        }  border h-[55px] border-gray-100`}
                        key={i}
                      >
                        <div className="bg-[#67799766] font-semibold rounded-sm text-[#1E1E1ECC] text-center text-[10px] pt-[1px] pb-[1px] pr-[4px] pl-[4px]">
                          19
                        </div>
                      </div>
                    ))}
                </div>
                {category.isExpanded &&
                  category.rooms.map((room) => {
                    const roomReservations = reservations
                      .filter((res) => res.roomId === room.id)
                      .filter((res) =>
                        isReservationVisible(res, startDate, frameDate)
                      );
                    return (
                      <SchedulerGrid
                        frameDate={frameDate}
                        key={room.id}
                        id={room.id}
                        roomType={room.name || ""}
                        dates={dates}
                        row={1}
                        reservations={roomReservations}
                        onReservationUpdate={(updatedReservations) =>
                          handleReservationUpdate(updatedReservations, room.id)
                        }
                        onReservationSelect={handleReservationFormOpen}
                        allRoomIds={allRoomIds()}
                      />
                    );
                  })}
              </>
            );
          })}
        </div>
      </div>

      {selectedRoom && (
        <RoomPopover
          room={selectedRoom}
          isOpen={isRoomPopoverOpen}
          onClose={() => setIsRoomPopoverOpen(false)}
        />
      )}

      <ReservationForm
        isOpen={isReservationFormOpen}
        onClose={() => setIsReservationFormOpen(false)}
        reservation={selectedReservation}
        onSave={handleSaveReservation}
      />
    </>
  );
};
