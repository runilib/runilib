import { WalkitProvider } from "@runilib/react-walkit";
import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { TOUR_LABELS, TOUR_THEME } from "./tourConfig";

type Page = "dashboard" | "settings";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <WalkitProvider
      animationType="bounce"
      overlayColor="rgba(10,9,7,0.82)"
      spotlightPadding={10}
      spotlightBorderRadius={14}
      theme={TOUR_THEME}
      labels={TOUR_LABELS}
      stopOnOutsideClick
      onStart={() => console.log("[@runilib/react-walkit]:onStart tour started")}
      onStop={() => console.log("[@runilib/react-walkit]:onStop tour ended")}
      onStepChange={(step, i) =>
        console.log(`[@runilib/react-walkit]:onStepChange step ${i + 1}: ${step.id}`)
      }
    >
      {page === "dashboard" && (
        <Dashboard
          onGoToSettings={() => setPage("settings")}
          onRestartTour={() => setPage("dashboard")}
        />
      )}
      {page === "settings" && <Settings onBack={() => setPage("dashboard")} />}
    </WalkitProvider>
  );
}
