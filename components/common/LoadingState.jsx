// components/common/LoadingState.jsx
import { Loader2 } from "lucide-react";

export function LoadingState({ text = "Loading..." }) {
  return (
    <div className="container mx-auto p-4 min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-darkb" />
        <p className="text-darkb">{text}</p>
      </div>
    </div>
  );
}
