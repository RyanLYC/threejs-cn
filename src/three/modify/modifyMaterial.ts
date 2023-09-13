import type THREE from 'three'
import vertex from '@/shader/planeColor/vertex.glsl?raw'
import fragment from '@/shader/planeColor/fragment.glsl?raw'

function shaderColor(
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>
) {
  // console.log(mesh);
  // 传递unfiorm变量
  mesh.material.onBeforeCompile = (shader) => {
    // console.log(shader.vertexShader);
    // console.log(shader.fragmentShader);
    shader.fragmentShader = fragment
    shader.vertexShader = vertex
  }
}
export default shaderColor
