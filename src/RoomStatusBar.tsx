import { useState } from "react";
import { CircleMinus, CirclePlus, Filter, Keyboard } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { Select } from "./Select";
import { useRoomFilters } from "./useRoomFilters";

interface DateNumber {
  frameDate: number | null;
  setFrameDate: (x: number) => void;
  onToggleShortcutsGuide: () => void;
}

interface RoomStatus {
  assignedRooms: number;
  unassignedRooms: number;
  totalRooms: number;
  occupancyRate: number;
}

const roomTypeOptions = [
  { value: "", label: "All Types" },
  { value: "standard", label: "Standard" },
  { value: "deluxe", label: "Deluxe" },
  { value: "suite", label: "Suite" },
  { value: "executive", label: "Executive" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
  { value: "cleaning", label: "Cleaning" },
];

const floorOptions = [
  { value: "", label: "All Floors" },
  { value: "1", label: "Floor 1" },
  { value: "2", label: "Floor 2" },
  { value: "3", label: "Floor 3" },
];

export default function RoomStatusBar({
  frameDate,
  setFrameDate,
  onToggleShortcutsGuide,
}: DateNumber) {
  const [roomStatus, setRoomStatus] = useState<RoomStatus>({
    assignedRooms: 15,
    unassignedRooms: 5,
    totalRooms: 20,
    occupancyRate: 75,
  });

  const [activeButton, setActiveButton] = useState<"plus" | "minus">("plus");
  const [showFilters, setShowFilters] = useState(false);

  const { searchQuery, setSearchQuery, filters, updateFilter, clearFilters } =
    useRoomFilters([]);

  const handleFrameDateChange = (buttonType: "plus" | "minus") => {
    if (!frameDate) return;

    if (buttonType === "plus" && frameDate > 14) {
      setFrameDate(frameDate - 7);
    }
    if (buttonType === "minus" && frameDate < 28) {
      setFrameDate(frameDate + 7);
    }
    setActiveButton(buttonType);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Room Status Section */}
          <div className="flex items-center space-x-8">
            <div className="flex flex-col">
              <h2 className="text-sm font-medium text-gray-700">Room Status</h2>
              <div className="flex items-center mt-1 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">
                    Assigned ({roomStatus.assignedRooms})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm">
                    Unassigned ({roomStatus.unassignedRooms})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">
                    {roomStatus.occupancyRate}% Occupancy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex items-center space-x-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-64"
            />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md border ${
                showFilters
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
              aria-label="Toggle filters"
            >
              <Filter className="h-5 w-5" />
            </button>

            <button
              onClick={onToggleShortcutsGuide}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              aria-label="Show keyboard shortcuts"
            >
              <Keyboard className="h-5 w-5" />
            </button>
          </div>

          {/* View Controls Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border bg-gray-50 rounded-full h-9">
              <button
                className={`px-3 rounded-l-full h-full transition-colors duration-200 ${
                  activeButton === "minus"
                    ? "bg-gray-200 text-gray-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleFrameDateChange("minus")}
                disabled={frameDate === 28}
                aria-label="Decrease time frame"
              >
                <CircleMinus className="h-4 w-4" />
              </button>
              <span className="px-3 text-sm font-medium text-gray-700">
                {frameDate} Days
              </span>
              <button
                className={`px-3 rounded-r-full h-full transition-colors duration-200 ${
                  activeButton === "plus"
                    ? "bg-gray-200 text-gray-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleFrameDateChange("plus")}
                disabled={frameDate === 14}
                aria-label="Increase time frame"
              >
                <CirclePlus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <div className="grid grid-cols-4 gap-4">
              <Select
                label="Room Type"
                value={filters.roomType}
                onChange={(value) => updateFilter("roomType", value)}
                options={roomTypeOptions}
              />
              <Select
                label="Status"
                value={filters.status}
                onChange={(value) => updateFilter("status", value)}
                options={statusOptions}
              />
              <Select
                label="Floor"
                value={filters.floor}
                onChange={(value) => updateFilter("floor", value)}
                options={floorOptions}
              />
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md 
                           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
