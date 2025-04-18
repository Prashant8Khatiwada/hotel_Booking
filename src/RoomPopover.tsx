import { useState, type FC } from "react";
import {
  BedDouble,
  Users,
  Wifi,
  Coffee,
  Cigarette,
  Ban,
  Settings,
  Link,
  Check,
  X,
} from "lucide-react";
import { useFocusTrap } from "./useFocusTrap";

interface RoomPopoverProps {
  room: {
    id: string;
    number: string;
    name?: string;
    icon?: {
      name: string;
      src: string;
    }[];
    isExpanded: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const RoomPopover: FC<RoomPopoverProps> = ({
  room,
  isOpen,
  onClose,
}) => {
  const modalRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "smoking":
        return <Cigarette className="h-5 w-5" />;
      case "no smoking":
      case "nosmoking":
        return <Ban className="h-5 w-5" />;
      case "house keeping":
      case "housekeeping":
        return <Coffee className="h-5 w-5" />;
      case "work order":
      case "workorder":
        return <Settings className="h-5 w-5" />;
      case "connected":
        return <Link className="h-5 w-5" />;
      case "clean":
      case "available":
        return <Check className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-details-title"
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg outline-none"
          tabIndex={-1}
        >
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close room details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <BedDouble className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3
                  id="room-details-title"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  {room.name || `Room ${room.number}`}
                </h3>

                <div className="mt-4 space-y-4">
                  {/* Room Features */}
                  <div
                    className="grid grid-cols-2 gap-4"
                    role="list"
                    aria-label="Room features"
                  >
                    <div className="flex items-center gap-2" role="listitem">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Max Occupancy: 2
                      </span>
                    </div>
                    <div className="flex items-center gap-2" role="listitem">
                      <Wifi className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Free Wi-Fi</span>
                    </div>
                  </div>

                  {/* Room Status */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Room Status
                    </h4>
                    <div
                      className="grid grid-cols-3 gap-4"
                      role="list"
                      aria-label="Room status indicators"
                    >
                      {room.icon?.map((icon, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2"
                          role="listitem"
                        >
                          <div className="text-gray-400">
                            {getIconComponent(icon.name)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {icon.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Additional Information
                    </h4>
                    <p className="text-sm text-gray-500">
                      Room includes standard amenities such as TV, air
                      conditioning, and daily housekeeping service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
