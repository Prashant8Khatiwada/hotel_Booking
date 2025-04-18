import { User } from "lucide-react";
import { useCalendarGrid, type Reservation } from "./useCalenderGrid";
import { useCallback, useEffect, useState } from "react";
import { ReservationTooltip } from "./ReservationTooltip";

interface SchedulerGridProps {
  id: string;
  frameDate: number;
  key: string;
  dates: {
    date: Date;
    day: number;
    month: number;
    year: number;
  }[];
  row: number;
  reservations: Reservation[];
  onReservationUpdate?: (reservations: Reservation[]) => void;
  onReservationSelect?: (reservation: Reservation) => void;
  allRoomIds?: string[]; // Add this to track all available rooms
  roomType: string; // Add this prop
}

/**
 * SchedulerGrid Component
 *
 * A calendar grid component for managing hotel room reservations with drag-and-drop functionality.
 *
 * Features:
 * - Drag and drop reservations between different room rows
 * - Resize reservations using handles
 * - Create new reservations by clicking and dragging
 * - Visual feedback for drag operations
 * - Support for different calendar view modes (14, 21, or 28 days)
 *
 * Props:
 * @param {string} id - Unique identifier for the room row
 * @param {number} frameDate - Number of days to display (14, 21, or 28)
 * @param {Array} dates - Array of date objects for the calendar
 * @param {number} row - Number of rows in the grid
 * @param {Array<Reservation>} reservations - Array of reservation objects
 * @param {Function} onReservationUpdate - Callback when reservations are modified
 * @param {Function} onReservationSelect - Callback when a reservation is selected
 * @param {Array<string>} allRoomIds - Array of all available room IDs for drag-drop operations
 */
export function SchedulerGrid({
  id,
  frameDate,
  dates,
  row,
  reservations,
  onReservationUpdate,
  onReservationSelect,
  allRoomIds,
  roomType, // Add this prop
}: SchedulerGridProps) {
  // Track whether this grid is a valid drop target
  const [dropTarget, setDropTarget] = useState<boolean>(false);
  const [focusedReservationId, setFocusedReservationId] = useState<
    string | null
  >(null);

  // Add new state for drag create indicator
  const [showDragIndicator, setShowDragIndicator] = useState(false);

  /**
   * Custom hook that provides grid functionality and state management
   * Handles drag, drop, resize, and selection operations
   */
  const {
    gridRef,
    isSelectingArea,
    isDragging,
    isResizing,
    dragPosition,
    draggedReservation,
    targetRoomId,
    handleGridMouseDown,
    handleGridMouseMove,
    handleGridMouseUp,
    handleReservationMouseDown,
    handleResizeStart,
  } = useCalendarGrid({
    id,
    dates,
    frameDate,
    initialReservations: reservations,
    onReservationUpdate,
    allRoomIds,
    roomType,
  });

  // Add hover effect to show drag indicator
  const handleGridMouseEnter = useCallback(() => {
    if (!isDragging && !isResizing) {
      setShowDragIndicator(true);
    }
  }, [isDragging, isResizing]);

  const handleGridMouseLeave = useCallback(() => {
    setShowDragIndicator(false);
  }, []);

  /**
   * Effect to handle drop target highlighting
   * Shows visual feedback when dragging a reservation over a different room
   */
  useEffect(() => {
    if (
      isDragging &&
      targetRoomId === id &&
      draggedReservation?.roomId !== id
    ) {
      setDropTarget(true);
    } else {
      setDropTarget(false);
    }
  }, [isDragging, targetRoomId, id, draggedReservation]);

  /**
   * Handles mouse up events for drag and selection operations
   * Triggers reservation selection after drag completes
   */
  const handleMouseUp = useCallback(() => {
    handleGridMouseUp();

    if (draggedReservation && !isSelectingArea && onReservationSelect) {
      setTimeout(() => {
        onReservationSelect(draggedReservation);
      }, 100);
    }
  }, [
    handleGridMouseUp,
    draggedReservation,
    isSelectingArea,
    onReservationSelect,
  ]);

  /**
   * Effect to manage global mouse up event listeners
   * Ensures drag and resize operations complete properly even when mouse is released outside the grid
   */
  useEffect(() => {
    if (isResizing || isSelectingArea || isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isSelectingArea, isResizing, isDragging, handleMouseUp]);

  const getColumnWidth = useCallback(() => {
    // These values should match your actual column widths from CSS
    if (frameDate === 28) return 36; // px per column for 28-day view
    if (frameDate === 21) return 49; // px per column for 21-day view
    return 72; // px per column for 14-day view (default)
  }, [frameDate]);

  const selectReservation = (reservationId: string) => {
    setFocusedReservationId(reservationId);
  };

  const renderReservation = (reservation: Reservation, isDragged: boolean) => {
    const days = Math.ceil(
      (reservation.endDate.getTime() - reservation.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const columnWidth = getColumnWidth();
    const calculatedWidth = days * columnWidth;

    const isFocused = focusedReservationId === reservation.id;

    const reservationContent = (
      <div
        key={reservation.id}
        className={`reservation absolute flex flex-col justify-center pl-3 pr-6 py-2 
          ${
            reservation.color
          } rounded-[4px_20px_20px_4px] w-fit max-w-full select-none 
          cursor-move transition-all duration-150 ease-out
          ${isDragged ? "z-50 shadow-lg scale-102" : "z-20 scale-100"}
          ${isFocused ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
        style={{
          left: `${reservation.left}px`,
          top: `${reservation.top}px`,
          width: `${calculatedWidth}px`,
          height: `${reservation.height}px`,
        }}
        onMouseDown={(e) => {
          if (e.button === 0) {
            handleReservationMouseDown(e, reservation);
          }
        }}
        onClick={() => selectReservation(reservation.id)}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        tabIndex={0}
        role="button"
        aria-label={`${
          reservation.guestName
        }'s reservation from ${reservation.startDate.toLocaleDateString()} to ${reservation.endDate.toLocaleDateString()}`}
        aria-pressed={isFocused}
        data-reservation-id={reservation.id}
      >
        <div className="flex flex-col gap-0.5 pt-2 pb-2 max-w-full leading-tight">
          <p className="font-semibold text-[12px] text-white truncate max-w-full">
            {reservation.guestName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white">
            <User className="h-4 w-4 text-black shrink-0" />
            <div className="ml-1 truncate">
              {reservation.startDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {reservation.endDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Resize handles with ARIA labels */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, reservation, "left")}
          role="slider"
          aria-label="Adjust reservation start date"
          tabIndex={0}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, reservation, "right")}
          role="slider"
          aria-label="Adjust reservation end date"
          tabIndex={0}
        />
      </div>
    );

    // Only wrap non-dragged reservations with tooltip
    return isDragged ? (
      reservationContent
    ) : (
      <ReservationTooltip
        key={reservation.id}
        content={{
          guestName: reservation.guestName,
          nights: days,
          adults: 2,
          children: 0,
          roomType: roomType,
          meals: "No Meals",
          totalAmount: 245060.72,
          paidAmount: 45060.0,
          balanceAmount: 200000.72,
          status: "Confirmed",
        }}
      >
        {reservationContent}
      </ReservationTooltip>
    );
  };

  return (
    <div
      ref={gridRef}
      className={`scheduler-grid relative ${
        isSelectingArea ? "cursor-crosshair" : ""
      } ${dropTarget ? "bg-green-50/30" : ""} 
      hover:bg-gray-50/50 transition-colors duration-200 min-h-[55px]`}
      data-room-id={id}
      data-room-type={roomType} // Add this data attribute
      onMouseDown={handleGridMouseDown}
      onMouseMove={handleGridMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleGridMouseEnter}
      onMouseLeave={handleGridMouseLeave}
    >
      {/* Grid Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div
          className={`grid ${
            frameDate === 28
              ? "grid-cols-28"
              : frameDate === 21
              ? "grid-cols-21"
              : "grid-cols-14"
          } h-full`}
        >
          {Array(frameDate)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="grid-cell relative h-full border-r border-gray-100 last:border-r-0"
                data-date={dates[i].date.toISOString()}
              >
                {/* Highlight weekends */}
                {[0, 6].includes(dates[i].date.getDay()) && (
                  <div className="absolute inset-0 bg-gray-50/30" />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Drag-to-create indicator */}
      {showDragIndicator && !isDragging && !isResizing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-blue-50/10">
          <div className="text-sm text-gray-600 bg-white/95 px-4 py-2 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Click and drag to create a new reservation
            </div>
          </div>
        </div>
      )}

      {/* Render non-dragged reservations */}
      {reservations.map(
        (reservation) =>
          draggedReservation?.id !== reservation.id &&
          renderReservation(reservation, false)
      )}

      {/* Render dragged reservation on top */}
      {(isDragging || isResizing) &&
        draggedReservation &&
        renderReservation(draggedReservation, true)}

      {/* Selection preview */}
      {isSelectingArea && dragPosition && (
        <div
          className="absolute rounded-md border-2 border-blue-500 bg-blue-100/30 
                     transition-all duration-75 ease-out z-20"
          style={{
            left: `${Math.min(dragPosition.startX, dragPosition.currentX)}px`,
            top: `${dragPosition.startY}px`,
            width: `${Math.abs(dragPosition.width)}px`,
            height: `${dragPosition.height}px`,
          }}
        />
      )}
    </div>
  );
}
