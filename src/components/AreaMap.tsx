"use client"

import { useEffect, useRef, useState } from "react"

interface AreaMapProps {
  onPolygonChange: (geojson: string) => void
  initialPolygon?: string
}

declare global {
  interface Window { L: any }
}

export function AreaMap({ onPolygonChange, initialPolygon }: AreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const polygonRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [points, setPoints] = useState<[number, number][]>([])
  const [leafletReady, setLeafletReady] = useState(false)
  const [hectares, setHectares] = useState<number | null>(null)

  // Load Leaflet dynamically (no SSR)
  useEffect(() => {
    if (typeof window === "undefined") return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => setLeafletReady(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  // Init map
  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstanceRef.current) return
    const L = window.L

    const map = L.map(mapRef.current, {
      center: [-13.5, -55.0],
      zoom: 5,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: "© Google Satellite"
    }).addTo(map)

    // Click to add points
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      setPoints(prev => {
        const updated = [...prev, [lat, lng] as [number, number]]
        drawPolygon(map, updated)
        return updated
      })
    })

    mapInstanceRef.current = map

    // Load initial polygon if provided
    if (initialPolygon) {
      try {
        const geo = JSON.parse(initialPolygon)
        const coords = geo.coordinates[0].map(([lng, lat]: number[]) => [lat, lng] as [number, number])
        setPoints(coords.slice(0, -1)) // remove closing point
        drawPolygon(map, coords.slice(0, -1))
        const bounds = coords.map(([lat, lng]: number[]) => [lat, lng])
        map.fitBounds(bounds, { padding: [30, 30] })
      } catch {}
    }
  }, [leafletReady])

  function drawPolygon(map: any, pts: [number, number][]) {
    const L = window.L

    // Remove old markers and polygon
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    if (polygonRef.current) polygonRef.current.remove()

    if (pts.length === 0) return

    // Draw markers
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:10px;height:10px;background:#16a34a;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    })
    pts.forEach(([lat, lng]) => {
      const m = L.marker([lat, lng], { icon }).addTo(map)
      markersRef.current.push(m)
    })

    // Draw polygon
    if (pts.length >= 3) {
      const poly = L.polygon(pts, {
        color: "#16a34a",
        fillColor: "#16a34a",
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(map)
      polygonRef.current = poly

      // Estimate hectares (rough spherical calculation)
      const areaM2 = L.GeometryUtil?.geodesicArea
        ? L.GeometryUtil.geodesicArea(pts.map(([lat, lng]) => ({ lat, lng })))
        : approximateArea(pts)
      setHectares(areaM2 / 10000)

      // Build GeoJSON
      const closing = pts[0]
      const coordinates = [[...pts, closing].map(([lat, lng]) => [lng, lat])]
      const geojson = JSON.stringify({ type: "Polygon", coordinates })
      onPolygonChange(geojson)
    } else {
      setHectares(null)
    }
  }

  function approximateArea(pts: [number, number][]): number {
    // Shoelace formula with degree-to-meter approximation
    let area = 0
    const n = pts.length
    for (let i = 0; i < n; i++) {
      const [lat1, lng1] = pts[i]
      const [lat2, lng2] = pts[(i + 1) % n]
      area += lng1 * lat2 - lng2 * lat1
    }
    const degArea = Math.abs(area) / 2
    // approx: 1 degree lat ≈ 111km, 1 degree lng ≈ 111km * cos(lat)
    const midLat = pts.reduce((a, [lat]) => a + lat, 0) / n
    return degArea * 111000 * 111000 * Math.cos((midLat * Math.PI) / 180)
  }

  function undo() {
    setPoints(prev => {
      const updated = prev.slice(0, -1)
      if (mapInstanceRef.current) drawPolygon(mapInstanceRef.current, updated)
      return updated
    })
  }

  function clear() {
    setPoints([])
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    if (polygonRef.current) { polygonRef.current.remove(); polygonRef.current = null }
    setHectares(null)
    onPolygonChange("")
  }

  function locateUser() {
    if (!mapInstanceRef.current) return
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      mapInstanceRef.current.setView([coords.latitude, coords.longitude], 14)
    })
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs font-medium text-green-700">
            {points.length} ponto{points.length !== 1 ? "s" : ""} marcado{points.length !== 1 ? "s" : ""}
          </span>
          {hectares && hectares > 0 && (
            <span className="text-xs font-bold text-green-800 ml-1">
              ≈ {hectares.toFixed(1)} ha
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={undo}
          disabled={points.length === 0}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          ↩ Desfazer
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={points.length === 0}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
        >
          🗑 Limpar
        </button>
        <button
          type="button"
          onClick={locateUser}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
        >
          📍 Minha localização
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full rounded-2xl border border-gray-200 overflow-hidden"
        style={{ height: 400 }}
      />

      {/* Instructions */}
      <p className="text-xs text-gray-400 text-center">
        Clique no mapa para marcar os vértices da sua lavoura. Mínimo de 3 pontos para formar o polígono.
      </p>

      {!leafletReady && (
        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
            Carregando mapa...
          </div>
        </div>
      )}
    </div>
  )
}
