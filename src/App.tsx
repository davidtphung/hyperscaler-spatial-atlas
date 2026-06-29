import { useAppRoute } from './hooks/useAppRoute'
import { AboutPage } from './pages/AboutPage'
import { DataSourcesPage } from './pages/DataSourcesPage'
import { MapApp } from './pages/MapApp'

function App() {
  const [route] = useAppRoute()

  if (route === 'about') return <AboutPage />
  if (route === 'sources') return <DataSourcesPage />
  return <MapApp />
}

export default App