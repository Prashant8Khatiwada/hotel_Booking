import { useRef, useState, useCallback, useEffect } from "react";

export interface Reservation {
  id: string;
  guestName: string;
  startDate: Date;
  endDate: Date;
  color: string;
  left: number;
  top: number;
  width: number;
  height: number;
  roomId: string;
  roomType: string;
  adults?: number;
  children?: number;
  meals?: string;
  amount?: number;
  paymentStatus?: 'Pending' | 'Partial' | 'Paid';
}

interface Position {
  startX: number;
  startY: number;
  currentX: number;
  width: number;
  height: number;
}

interface DragInfo {
  initialX: number;
  initialY: number;
  offsetX: number;
  offsetY: number;
}

interface UseCalendarGridProps {
  id: string;
  dates: { date: Date }[];
  frameDate: number;
  initialReservations: Reservation[];
  onReservationUpdate?: (reservations: Reservation[]) => void;
  allRoomIds?: string[];
  roomType: string;
}

interface KeyboardShortcuts {
  moveLeft: string[];
  moveRight: string[];
  moveUp: string[];
  moveDown: string[];
  delete: string[];
  escape: string[];
  confirm: string[];
}

const KEYBOARD_SHORTCUTS: KeyboardShortcuts = {
  moveLeft: ['ArrowLeft'],
  moveRight: ['ArrowRight'],
  moveUp: ['ArrowUp'],
  moveDown: ['ArrowDown'],
  delete: ['Delete', 'Backspace'],
  escape: ['Escape'],
  confirm: ['Enter', ' ']
};

const DEFAULT_CHECK_IN_TIME = 14; // 2 PM
const DEFAULT_CHECK_OUT_TIME = 11; // 11 AM

/**
 * Custom hook for managing a calendar grid with drag-and-drop reservation functionality
 * 
 * Features:
 * - Create new reservations by dragging on the grid
 * - Drag existing reservations between dates and rooms
 * - Resize reservations from either end
 * - Snap to grid functionality
 * - Boundary checks for valid dates and positions
 * 
 * @param {string} id - Unique identifier for the room/row
 * @param {Array} dates - Array of date objects for the calendar range
 * @param {number} frameDate - Number of days to display (14, 21, or 28)
 * @param {Array<Reservation>} initialReservations - Initial reservations to display
 * @param {Function} onReservationUpdate - Callback when reservations change
 * @param {Array<string>} allRoomIds - Available room IDs for drag-drop operations
 */
export function useCalendarGrid({
  id,
  dates,
  frameDate,
  initialReservations,
  onReservationUpdate,
  allRoomIds,
  roomType,
}: UseCalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isSelectingArea, setIsSelectingArea] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragPosition, setDragPosition] = useState<Position | null>(null);
  const [draggedReservation, setDraggedReservation] = useState<Reservation | null>(null);
  const [targetRoomId, setTargetRoomId] = useState<string | null>(null);
  const [focusedReservationId, setFocusedReservationId] = useState<string | null>(null);
  const dragInfo = useRef<DragInfo | null>(null);
  const resizeDirection = useRef<"left" | "right" | null>(null);

  const getColumnWidth = useCallback(() => {
    if (frameDate === 28) return 36;
    if (frameDate === 21) return 49;
    return 72;
  }, [frameDate]);

  const getDateFromX = useCallback((x: number): Date => {
    if (!gridRef.current) return new Date();

    const columnWidth = getColumnWidth();
    const columnIndex = Math.floor(x / columnWidth);
    const date = new Date(dates[Math.min(Math.max(0, columnIndex), dates.length - 1)].date);
    return date;
  }, [dates, getColumnWidth]);

  const getXFromDate = useCallback((date: Date): number => {
    if (!gridRef.current) return 0;

    const columnWidth = getColumnWidth();
    const daysDiff = Math.floor((date.getTime() - dates[0].date.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff * columnWidth;
  }, [dates, getColumnWidth]);

  const createNewReservation = useCallback((startX: number, width: number): Reservation => {
    const startDate = getDateFromX(startX);
    const endDate = getDateFromX(startX + width);

    // Set check-in time to 2 PM
    startDate.setHours(DEFAULT_CHECK_IN_TIME, 0, 0, 0);

    // Set check-out time to 11 AM
    endDate.setHours(DEFAULT_CHECK_OUT_TIME, 0, 0, 0);

    // Ensure end date is at least one day after start date
    if (endDate <= startDate) {
      endDate.setDate(startDate.getDate() + 1);
    }

    return {
      id: `res-${Date.now()}`,
      guestName: "New Reservation",
      startDate,
      endDate,
      color: "bg-[#8bdd6b]",
      left: startX,
      top: 5,
      width,
      height: 34,
      roomId: id,
      roomType,
    };
  }, [id, getDateFromX, roomType]);

  const handleGridMouseDown = useCallback((e: React.MouseEvent) => {
    if (!gridRef.current || e.button !== 0) return;

    const rect = gridRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setIsSelectingArea(true);
    setDragPosition({
      startX,
      startY,
      currentX: startX,
      width: 0,
      height: 34,
    });
  }, []);

  const handleGridMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;

    if (isSelectingArea && dragPosition) {
      setDragPosition(prev => ({
        ...prev!,
        currentX,
        width: currentX - prev!.startX,
      }));
    } else if (isDragging && draggedReservation && dragInfo.current) {
      const newLeft = e.clientX - rect.left - dragInfo.current.offsetX;
      const roomElement = (e.target as HTMLElement).closest('[data-room-id]');
      const newRoomId = roomElement?.getAttribute('data-room-id') || id;

      if (allRoomIds?.includes(newRoomId)) {
        setTargetRoomId(newRoomId);
        setDraggedReservation(prev => ({
          ...prev!,
          left: newLeft,
          roomId: newRoomId,
        }));
      }
    }
  }, [isSelectingArea, isDragging, dragPosition, draggedReservation, id, allRoomIds]);

  const handleGridMouseUp = useCallback(() => {
    if (isSelectingArea && dragPosition && Math.abs(dragPosition.width) > 10) {
      const newReservation = createNewReservation(
        Math.min(dragPosition.startX, dragPosition.currentX),
        Math.abs(dragPosition.width)
      );

      onReservationUpdate?.([...initialReservations, newReservation]);
    }

    if ((isDragging || isResizing) && draggedReservation) {
      const updatedReservations = initialReservations.map(res =>
        res.id === draggedReservation.id ? draggedReservation : res
      );
      onReservationUpdate?.(updatedReservations);
    }

    setIsSelectingArea(false);
    setIsDragging(false);
    setIsResizing(false);
    setDragPosition(null);
    setDraggedReservation(null);
    setTargetRoomId(null);
    dragInfo.current = null;
    resizeDirection.current = null;
  }, [isSelectingArea, isDragging, isResizing, dragPosition, draggedReservation, initialReservations, onReservationUpdate, createNewReservation]);

  const handleReservationMouseDown = useCallback((e: React.MouseEvent, reservation: Reservation) => {
    e.stopPropagation();
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    dragInfo.current = {
      initialX: e.clientX,
      initialY: e.clientY,
      offsetX: e.clientX - rect.left - reservation.left,
      offsetY: e.clientY - rect.top - reservation.top,
    };

    setIsDragging(true);
    setDraggedReservation(reservation);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, reservation: Reservation, direction: "left" | "right") => {
    e.stopPropagation();
    resizeDirection.current = direction;
    setIsResizing(true);
    setDraggedReservation(reservation);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!focusedReservationId) return;

    const reservation = initialReservations.find(r => r.id === focusedReservationId);
    if (!reservation) return;

    if (KEYBOARD_SHORTCUTS.moveLeft.includes(e.key)) {
      e.preventDefault();
      // Move reservation one day left
      const newStartDate = new Date(reservation.startDate);
      newStartDate.setDate(newStartDate.getDate() - 1);
      const newEndDate = new Date(reservation.endDate);
      newEndDate.setDate(newEndDate.getDate() - 1);

      if (newStartDate >= dates[0].date) {
        const updatedReservation = {
          ...reservation,
          startDate: newStartDate,
          endDate: newEndDate,
          left: reservation.left - getColumnWidth()
        };
        onReservationUpdate?.([updatedReservation]);
      }
    }

    if (KEYBOARD_SHORTCUTS.moveRight.includes(e.key)) {
      e.preventDefault();
      // Move reservation one day right
      const newStartDate = new Date(reservation.startDate);
      newStartDate.setDate(newStartDate.getDate() + 1);
      const newEndDate = new Date(reservation.endDate);
      newEndDate.setDate(newEndDate.getDate() + 1);

      if (newEndDate <= dates[dates.length - 1].date) {
        const updatedReservation = {
          ...reservation,
          startDate: newStartDate,
          endDate: newEndDate,
          left: reservation.left + getColumnWidth()
        };
        onReservationUpdate?.([updatedReservation]);
      }
    }

    if (KEYBOARD_SHORTCUTS.moveUp.includes(e.key) || KEYBOARD_SHORTCUTS.moveDown.includes(e.key)) {
      e.preventDefault();
      // Find adjacent room in the specified direction
      const direction = KEYBOARD_SHORTCUTS.moveUp.includes(e.key) ? -1 : 1;
      if (allRoomIds) {
        const currentIndex = allRoomIds.indexOf(reservation.roomId);
        const targetIndex = currentIndex + direction;

        if (targetIndex >= 0 && targetIndex < allRoomIds.length) {
          const updatedReservation = {
            ...reservation,
            roomId: allRoomIds[targetIndex],
            top: reservation.top + (direction * 34)
          };
          onReservationUpdate?.([updatedReservation]);
        }
      }
    }

    if (KEYBOARD_SHORTCUTS.delete.includes(e.key)) {
      e.preventDefault();
      // Remove the reservation
      onReservationUpdate?.(
        initialReservations.filter(r => r.id !== focusedReservationId)
      );
      setFocusedReservationId(null);
    }

    if (KEYBOARD_SHORTCUTS.escape.includes(e.key)) {
      e.preventDefault();
      setFocusedReservationId(null);
    }
  }, [focusedReservationId, initialReservations, dates, onReservationUpdate, allRoomIds]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const selectReservation = useCallback((reservationId: string) => {
    setFocusedReservationId(reservationId);
  }, []);

  return {
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
    focusedReservationId,
    selectReservation,
  };
}
