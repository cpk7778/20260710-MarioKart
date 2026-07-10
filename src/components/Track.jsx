import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const CHUNK_SIZE = 48
const VIEW_RADIUS = 4

function hash2(x, z) {
  let h = x * 374761393 + z * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return (h ^ (h >> 16)) >>> 0
}

function TerrainChunk({ offset }) {
  const [ox, , oz] = offset
  const grassTone = hash2(ox, oz) % 3
  const grassColor = ['#4caf50', '#43a047', '#388e3c'][grassTone]

  const trees = []
  for (let i = 0; i < 6; i++) {
    const seed = hash2(ox + i * 17, oz + i * 31)
    const tx = (seed % 1000) / 1000 * CHUNK_SIZE - CHUNK_SIZE / 2
    const tz = ((seed >> 10) % 1000) / 1000 * CHUNK_SIZE - CHUNK_SIZE / 2
    const scale = 0.7 + ((seed >> 20) % 5) * 0.12
    trees.push({ tx, tz, scale, key: i })
  }

  return (
    <group position={offset}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color={grassColor} />
      </mesh>

      {/* 도로 느낌의 격자 장식 */}
      {(hash2(ox, oz) & 1) === 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[10, CHUNK_SIZE]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      )}

      {trees.map(({ tx, tz, scale, key }) => (
        <group key={key} position={[tx, 0, tz]} scale={scale}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.22, 1.2, 6]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
          <mesh position={[0, 1.35, 0]} castShadow>
            <coneGeometry args={[0.9, 1.4, 8]} />
            <meshStandardMaterial color="#2e7d32" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Track({ kartRef }) {
  const worldRef = useRef()

  useFrame(() => {
    const kart = kartRef?.current
    if (!kart || !worldRef.current) return

    const snapX = Math.floor(kart.position.x / CHUNK_SIZE) * CHUNK_SIZE
    const snapZ = Math.floor(kart.position.z / CHUNK_SIZE) * CHUNK_SIZE
    worldRef.current.position.set(snapX, 0, snapZ)
  })

  const chunks = []
  for (let ix = -VIEW_RADIUS; ix <= VIEW_RADIUS; ix++) {
    for (let iz = -VIEW_RADIUS; iz <= VIEW_RADIUS; iz++) {
      chunks.push(
        <TerrainChunk
          key={`${ix},${iz}`}
          offset={[ix * CHUNK_SIZE, 0, iz * CHUNK_SIZE]}
        />
      )
    }
  }

  return <group ref={worldRef}>{chunks}</group>
}
