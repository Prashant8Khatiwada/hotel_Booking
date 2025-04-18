import type { FC } from "react";
import {
  User,
  Calendar,
  Users,
  Utensils,
  CreditCard,
  CheckCircle,
} from "lucide-react";

interface ReservationTooltipContent {
  guestName: string;
  nights: number;
  adults: number;
  children: number;
  roomType: string;
  meals: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
}

interface ReservationTooltipProps {
  content: ReservationTooltipContent;
  children: React.ReactNode;
}

export const ReservationTooltip: FC<ReservationTooltipProps> = ({
  content,
  children,
}) => {
  return (
    <div className="group relative">
      {children}

      <div
        className="hidden group-hover:block absolute z-50 w-80 p-4 mt-2 
                    bg-white rounded-lg shadow-xl border border-gray-200 
                    transform -translate-x-1/2 left-1/2"
      >
        {/* Arrow */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 
                      border-8 border-transparent border-b-white"
        ></div>

        <div className="space-y-3">
          {/* Guest Info */}
          <div className="flex items-start justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-900">
                {content.guestName}
              </span>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                content.status === "Confirmed"
                  ? "bg-green-100 text-green-800"
                  : content.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {content.status}
            </span>
          </div>

          {/* Stay Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{content.nights} nights</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {content.adults} adults, {content.children} children
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{content.roomType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{content.meals}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="font-medium">
                ${content.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Paid Amount</span>
              </div>
              <span className="text-green-600 font-medium">
                ${content.paidAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center font-medium">
              <span className="text-sm text-gray-900">Balance</span>
              <span className="text-orange-600">
                ${content.balanceAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
