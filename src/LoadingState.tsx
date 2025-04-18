import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export const LoadingState = ({
  message = "Loading...",
  className = "",
  size = "medium",
}: LoadingStateProps) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${className}`}
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};
