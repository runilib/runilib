import { useState } from 'react';
import { TooltipProvider } from '@runilib/tooltip';
import { Dashboard } from './pages/Dashboard';
import { Settings  } from './pages/Settings';
import { TOUR_THEME, TOUR_LABELS } from './tourConfig';

type Page = 'dashboard' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <TooltipProvider
      animationType={page === 'settings' ? 'flip' : 'bounce'}
      overlayColor="rgba(10,9,7,0.82)"
      spotlightPadding={10}
      spotlightBorderRadius={14}
      theme={TOUR_THEME}
      labels={TOUR_LABELS}
      maskClickable={false}
      onStart={() => console.log('[stepwise] tour started')}
      onStop={() => console.log('[stepwise] tour ended')}
      onStepChange={(step, i) => console.log(`[stepwise] step ${i + 1}: ${step.name}`)}
      
    >
      {page === 'dashboard' && (
        <Dashboard
          onGoToSettings={() => setPage('settings')}
          onRestartTour={() => setPage('dashboard')}
        />
      )}
      {page === 'settings' && (
        <Settings onBack={() => setPage('dashboard')} />
      )}
    </TooltipProvider>
  );
}
