import { useAppRoute } from './hooks/useAppRoute'
import { AboutPage } from './pages/AboutPage'
import { DataSourcesPage } from './pages/DataSourcesPage'
import { DashboardPage } from './pages/DashboardPage'
import { TimelinePage } from './pages/TimelinePage'
import { ComparePage } from './pages/ComparePage'
import { ForecastsPage } from './pages/ForecastsPage'
import { MapApp } from './pages/MapApp'

function App() {
  const [route] = useAppRoute()

  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'timeline':
      return <TimelinePage />
    case 'map':
      return <MapApp />
    case 'compare':
      return <ComparePage />
    case 'forecasts':
      return <ForecastsPage />
    case 'sources':
      return <DataSourcesPage />
    case 'about':
      return <AboutPage />
    default:
      return <DashboardPage />
  }
}

export default App