import * as THREE from 'three'
import scene from '../scene'
import modifyMaterial from '../modify/modifyMaterial'

export default function createCity() {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial()
  )
  plane.position.set(0, 0, -6)
  plane.receiveShadow = true
  modifyMaterial(plane)
  scene.add(plane)
}
