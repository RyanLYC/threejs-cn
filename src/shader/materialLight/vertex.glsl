varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main(){
    gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);

    vUv=uv;
    vPosition=position;
    vNormal = normalize(normalMatrix * normal);
}
