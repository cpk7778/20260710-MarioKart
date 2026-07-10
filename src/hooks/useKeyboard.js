import { useEffect, useRef } from 'react'

/**
 * 방향키/WASD 입력 상태를 추적하는 훅.
 * 매 프레임 리렌더링을 피하기 위해 ref 객체를 그대로 반환한다.
 */
export function useKeyboard() {
  const keys = useRef({ forward: false, backward: false, left: false, right: false })

  useEffect(() => {
    const setKey = (code, value) => {
      switch (code) {
        case 'ArrowUp':
        case 'KeyW':
          keys.current.forward = value
          break
        case 'ArrowDown':
        case 'KeyS':
          keys.current.backward = value
          break
        case 'ArrowLeft':
        case 'KeyA':
          keys.current.left = value
          break
        case 'ArrowRight':
        case 'KeyD':
          keys.current.right = value
          break
        default:
          break
      }
    }

    const handleKeyDown = (e) => setKey(e.code, true)
    const handleKeyUp = (e) => setKey(e.code, false)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys.current
}
