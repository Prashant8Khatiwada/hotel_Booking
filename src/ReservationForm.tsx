import { useState, useEffect, type FC } from "react";
import { X } from "lucide-react";
import type { Reservation } from "./useCalenderGrid";
import { useFocusTrap } from "./useFocusTrap";

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  onSave: (reservation: Reservation) => void;
}

interface FormErrors {
  guestName?: string;
  startDate?: string;
  endDate?: string;
  submit?: string;
}

interface FormData extends Partial<Reservation> {
  adults?: number;
  children?: number;
  meals?: string;
  amount?: number;
  paymentStatus?: "Pending" | "Partial" | "Paid";
}

export const ReservationForm: FC<ReservationFormProps> = ({
  isOpen,
  onClose,
  reservation,
  onSave,
}) => {
  const modalRef = useFocusTrap(isOpen);
  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    color: "bg-[#8bdd6b]",
    startDate: new Date(),
    endDate: new Date(),
    adults: 2,
    children: 0,
    meals: "No Meals",
    amount: 0,
    paymentStatus: "Pending",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        ...reservation,
      });
    } else {
      setFormData({
        guestName: "",
        color: "bg-[#8bdd6b]",
        startDate: new Date(),
        endDate: new Date(),
        adults: 2,
        children: 0,
        meals: "No Meals",
        amount: 0,
        paymentStatus: "Pending",
      });
    }
    setErrors({});
  }, [reservation, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.guestName?.trim()) {
      newErrors.guestName = "Guest name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = new Date(value);

    if (!isNaN(date.getTime())) {
      setFormData((prev) => ({ ...prev, [name]: date }));
      // Clear error when field is modified
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (
        reservation &&
        formData.guestName &&
        formData.startDate &&
        formData.endDate
      ) {
        onSave({
          ...reservation,
          ...formData,
          guestName: formData.guestName,
          color: formData.color || "bg-[#8bdd6b]",
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        } as Reservation);
      }
      onClose();
    } catch (error) {
      console.error("Error saving reservation:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save reservation. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formatDateForInput = (date?: Date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const formId = "reservation-form";
  const titleId = "reservation-form-title";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative outline-none"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id={titleId} className="text-xl font-semibold text-gray-800">
            {reservation?.id ? "Edit Reservation" : "New Reservation"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          id={formId}
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="guestName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Guest Name
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">required</span>
              </label>
              <input
                id="guestName"
                name="guestName"
                type="text"
                value={formData.guestName || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.guestName ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter guest name"
                aria-required="true"
                aria-invalid={Boolean(errors.guestName)}
                aria-describedby={
                  errors.guestName ? "guestName-error" : undefined
                }
              />
              {errors.guestName && (
                <p
                  id="guestName-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.guestName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Guests
              </label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="text-xs text-gray-500">Adults</label>
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    value={formData.adults || 1}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Children</label>
                  <input
                    type="number"
                    name="children"
                    min="0"
                    value={formData.children || 0}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Check-in Date
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">required</span>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formatDateForInput(formData.startDate)}
                onChange={handleDateChange}
                min={formatDateForInput(new Date())}
                className={`w-full px-3 py-2 border ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                aria-required="true"
                aria-invalid={Boolean(errors.startDate)}
                aria-describedby={
                  errors.startDate ? "startDate-error" : undefined
                }
              />
              {errors.startDate && (
                <p
                  id="startDate-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Check-out Date
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">required</span>
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formatDateForInput(formData.endDate)}
                onChange={handleDateChange}
                min={formatDateForInput(formData.startDate)}
                className={`w-full px-3 py-2 border ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                aria-required="true"
                aria-invalid={Boolean(errors.endDate)}
                aria-describedby={errors.endDate ? "endDate-error" : undefined}
              />
              {errors.endDate && (
                <p
                  id="endDate-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.endDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meal Plan
              </label>
              <select
                name="meals"
                value={formData.meals}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="No Meals">No Meals</option>
                <option value="Breakfast">Breakfast Only</option>
                <option value="Half Board">Half Board</option>
                <option value="Full Board">Full Board</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount || 0}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <div className="flex gap-4">
              {["Pending", "Partial", "Paid"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value={status}
                    checked={formData.paymentStatus === status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentStatus: e.target.value as
                          | "Pending"
                          | "Partial"
                          | "Paid",
                      }))
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Reservation Color
            </span>
            <div
              className="flex gap-3"
              role="radiogroup"
              aria-label="Reservation color"
            >
              {[
                "bg-[#8bdd6b]",
                "bg-[#67c7eb]",
                "bg-[#f8c273]",
                "bg-[#f87373]",
                "bg-[#d67bff]",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded-full transition-transform ${
                    formData.color === color
                      ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                      : "hover:scale-105"
                  } ${color}`}
                  onClick={() => handleColorChange(color)}
                  role="radio"
                  aria-checked={formData.color === color}
                  aria-label={`Color ${color
                    .replace("bg-[#", "")
                    .replace("]", "")}`}
                />
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4" role="alert">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
