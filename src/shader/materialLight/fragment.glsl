uniform float power;
uniform vec3 color;
varying vec2 vUv;
varying vec3 vNormal;

vec3 background(vec2 uv){
    float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
    float dist=length(uv-vec2(.5));
    vec3 bg=mix(vec3( .1),vec3(color),dist + intensity);
    return bg;
}

void main(){
    vec3 bg=background(vUv);
    vec3 color2=bg;

    gl_FragColor=vec4(color2,0.3);
}
