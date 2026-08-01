import { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboard } from '../hooks/useKeyboard'

// 주행 물리 파라미터 (프로토타입 튜닝값)
const ACCEL = 14
const BRAKE = 20
const MAX_SPEED = 22
const MAX_REVERSE = -8
const FRICTION = 7
const TURN_SPEED = 2.8

const Kart = forwardRef(function Kart({ onUpdate }, ref) {
  const keys = useKeyboard()
  const speedRef = useRef(0)
  const headingRef = useRef(0)

  useFrame((_, rawDelta) => {
    const group = ref.current
    if (!group) return
    const delta = Math.min(rawDelta, 0.05) // 탭 전환 등으로 인한 급격한 delta 방지

    // 가속 / 브레이크 / 관성 감속
    if (keys.forward) {
      speedRef.current += ACCEL * delta
    } else if (keys.backward) {
      speedRef.current -= BRAKE * delta
    } else {
      const s = speedRef.current
      if (s > 0) speedRef.current = Math.max(0, s - FRICTION * delta)
      else if (s < 0) speedRef.current = Math.min(0, s + FRICTION * delta)
    }
    speedRef.current = THREE.MathUtils.clamp(speedRef.current, MAX_REVERSE, MAX_SPEED)

    // 조향 (속도가 있을 때만 의미 있게 회전)
    const steerFactor = THREE.MathUtils.clamp(speedRef.current / MAX_SPEED, -1, 1)
    if (keys.left) headingRef.current += TURN_SPEED * delta * steerFactor
    if (keys.right) headingRef.current -= TURN_SPEED * delta * steerFactor

    // 이동
    const dx = Math.sin(headingRef.current) * speedRef.current * delta
    const dz = Math.cos(headingRef.current) * speedRef.current * delta
    group.position.x += dx
    group.position.z += dz
    group.rotation.y = headingRef.current

    onUpdate && onUpdate(speedRef.current)
  })

  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* Futuristic rider silhouette with silver suit and cyan energy lines */}
      <group position={[0, 0.18, 0]}>
        {/* hover board */}
        <mesh receiveShadow castShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[0.75, 0.08, 1.25]} />
          <meshStandardMaterial color="#7e8fa8" metalness={0.72} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.62, 0.02, 1.05]} />
          <meshStandardMaterial color="#87edff" emissive="#22b8d8" emissiveIntensity={1.25} />
        </mesh>

        {/* legs */}
        <mesh castShadow position={[-0.13, 0.42, 0.08]}>
          <capsuleGeometry args={[0.07, 0.34, 8, 14]} />
          <meshStandardMaterial color="#9aacc4" metalness={0.58} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0.13, 0.42, 0.08]}>
          <capsuleGeometry args={[0.07, 0.34, 8, 14]} />
          <meshStandardMaterial color="#9aacc4" metalness={0.58} roughness={0.3} />
        </mesh>

        {/* torso */}
        <mesh castShadow position={[0, 0.8, -0.02]}>
          <capsuleGeometry args={[0.16, 0.42, 8, 16]} />
          <meshStandardMaterial color="#c5d4e8" metalness={0.62} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.83, 0.13]}>
          <boxGeometry args={[0.18, 0.26, 0.04]} />
          <meshStandardMaterial color="#8cecff" emissive="#23bad9" emissiveIntensity={1.2} />
        </mesh>

        {/* shoulders and arms */}
        <mesh castShadow position={[-0.26, 0.88, -0.02]}>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial color="#a7b8cf" metalness={0.6} roughness={0.24} />
        </mesh>
        <mesh castShadow position={[0.26, 0.88, -0.02]}>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial color="#a7b8cf" metalness={0.6} roughness={0.24} />
        </mesh>
        <mesh castShadow position={[-0.34, 0.73, 0.03]} rotation={[0, 0, 0.55]}>
          <capsuleGeometry args={[0.05, 0.26, 8, 12]} />
          <meshStandardMaterial color="#9eb0c8" metalness={0.55} roughness={0.28} />
        </mesh>
        <mesh castShadow position={[0.34, 0.73, 0.03]} rotation={[0, 0, -0.55]}>
          <capsuleGeometry args={[0.05, 0.26, 8, 12]} />
          <meshStandardMaterial color="#9eb0c8" metalness={0.55} roughness={0.28} />
        </mesh>

        {/* head and visor */}
        <mesh castShadow position={[0, 1.16, -0.03]}>
          <sphereGeometry args={[0.12, 18, 18]} />
          <meshStandardMaterial color="#dde9f8" metalness={0.3} roughness={0.15} />
        </mesh>
        <mesh position={[0, 1.15, 0.07]}>
          <boxGeometry args={[0.16, 0.06, 0.03]} />
          <meshStandardMaterial color="#8ef0ff" emissive="#21b9d9" emissiveIntensity={1.45} />
        </mesh>

        {/* back energy ring */}
        <mesh position={[0, 0.86, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.03, 10, 28]} />
          <meshStandardMaterial color="#7beaff" emissive="#18add0" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  )
})

export default Kart
