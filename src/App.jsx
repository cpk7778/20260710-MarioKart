import { useState } from 'react'
import Scene from './components/Scene'

export default function App() {
  const [speed, setSpeed] = useState(0)
  const kmh = Math.max(0, Math.round(speed * 9))

  return (
    <div className="app">
      <Scene onSpeedChange={setSpeed} />

      <div className="hud hud-top">
        <span className="hud-title">MINI CUP · FREE ROAM</span>
      </div>

      <div className="hud hud-bottom-left">
        <div className="speed-label">SPEED</div>
        <div className="speed-value">{kmh}</div>
        <div className="speed-unit">km/h</div>
      </div>

      <div className="hud hud-bottom-right">
        <div className="controls-title">CONTROLS</div>
        <div className="controls-row">↑ / W — 가속</div>
        <div className="controls-row">↓ / S — 브레이크·후진</div>
        <div className="controls-row">← → / A D — 조향</div>
      </div>
    </div>
  )
}
