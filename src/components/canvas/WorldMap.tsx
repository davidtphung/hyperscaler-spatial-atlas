import { useMemo } from 'react'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import worldData from 'world-atlas/countries-110m.json'
import { MAP_HEIGHT, MAP_WIDTH, mapPath, getGraticuleLines } from '../../utils/geo'

const world = worldData as unknown as Topology<{ countries: GeometryCollection }>

export function WorldMap() {
  const countries = useMemo(() => {
    const geo = feature(world, world.objects.countries) as FeatureCollection
    return geo.features as Feature<Geometry>[]
  }, [])

  const graticule = useMemo(() => getGraticuleLines(), [])

  return (
    <g aria-hidden>
      {/* Ocean */}
      <rect
        x={0}
        y={0}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        fill="var(--ocean-fill)"
        stroke="var(--map-border)"
        strokeWidth={1}
      />

      {/* Graticule */}
      {graticule.map((line) => (
        <path
          key={`${line.type}-${line.value}`}
          d={line.path}
          fill="none"
          stroke="var(--graticule-line)"
          strokeWidth={line.type === 'lat' && line.value === 0 ? 0.8 : 0.4}
          strokeDasharray={line.type === 'lat' && line.value === 0 ? undefined : '2 4'}
          opacity={line.type === 'lat' && line.value === 0 ? 0.5 : 0.25}
        />
      ))}

      {/* Equator label */}
      <text
        x={MAP_WIDTH - 36}
        y={MAP_HEIGHT / 2 - 4}
        fill="var(--map-label)"
        fontSize={9}
        fontFamily="var(--font-mono)"
        opacity={0.6}
      >
        0°
      </text>

      {/* Countries */}
      {countries.map((country, i) => (
        <path
          key={country.id ?? i}
          d={mapPath(country) ?? ''}
          fill="var(--land-fill)"
          stroke="var(--land-stroke)"
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      ))}
    </g>
  )
}