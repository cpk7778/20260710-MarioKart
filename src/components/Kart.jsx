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
      {/* 차체 */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1, 0.5, 1.8]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
      {/* 캐빈 */}
      <mesh castShadow position={[0, 0.75, -0.15]}>
        <boxGeometry args={[0.7, 0.4, 0.8]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
      {/* 바퀴 */}
      {[
        [-0.55, 0.15, 0.65],
        [0.55, 0.15, 0.65],
        [-0.55, 0.15, -0.65],
        [0.55, 0.15, -0.65],
      ].map((p, i) => (
        <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
          <meshStandardMaterial color="#1d1d1d" />
        </mesh>
      ))}
    </group>
  )
})

export default Kart
