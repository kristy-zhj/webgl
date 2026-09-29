import { Canvas } from '@react-three/fiber'
import { FC } from 'react'

export const One: FC<{}> = () => {
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </>
  )
}
