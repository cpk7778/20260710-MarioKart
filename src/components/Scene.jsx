import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import Track from './Track'
import Kart from './Kart'

function CameraRig({ target }) {
  useFrame((state) => {
    const kart = target.current
    if (!kart) return
    // 카트 뒤쪽 위에서 따라가는 3인칭 카메라
    const offset = new THREE.Vector3(0, 4, -7.5)
    offset.applyEuler(kart.rotation)
    const camPos = kart.position.clone().add(offset)
    state.camera.position.lerp(camPos, 0.09)
    const lookTarget = kart.position.clone().add(new THREE.Vector3(0, 1, 0))
    state.camera.lookAt(lookTarget)
  })
  return null
}

export default function Scene({ onSpeedChange }) {
  const kartRef = useRef()

  return (
    <Canvas shadows camera={{ fov: 62, near: 0.1, far: 300, position: [0, 4, 30] }}>
      <color attach="background" args={['#87ceeb']} />
      <fog attach="fog" args={['#87ceeb', 40, 140]} />

      <ambientLight intensity={0.65} />
      <directionalLight
        position={[25, 35, 15]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Track kartRef={kartRef} />
      <Kart ref={kartRef} onUpdate={onSpeedChange} />
      <CameraRig target={kartRef} />
    </Canvas>
  )
}
