mport { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "md", 
  fullScreen = true 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex flex-col items-center justify-center bg-background"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-4`} />
        <div className="absolute inset-0 animate-pulse">
          <div className={`${sizeClasses[size]} rounded-full bg-primary/20`} />
        </div>
      </div>
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
};
