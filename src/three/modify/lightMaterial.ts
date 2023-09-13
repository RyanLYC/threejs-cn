import * as THREE from 'three'
import vertexShader from '@/shader/materialLight/vertex.glsl?raw'
import fragmentShader from '@/shader/materialLight/fragment.glsl?raw'

export default function lightMaterial(color: string) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      power: { value: 1 },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
  })
  return material
}
