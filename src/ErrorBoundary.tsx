import React from "react";
import { AlertOctagon } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 rounded-lg">
            <AlertOctagon className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-red-600 text-center max-w-md">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try refreshing the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                       transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
