uniform float u_time;
varying vec2 v_uv;
attribute float a_distort;
attribute float a_radius;
attribute float a_speed;
varying vec3 v_instanceColor;

#include snoise.glsl

void main() {
  v_uv = uv;
  v_instanceColor = instanceColor;

  // <MeshDistortMaterial />
  float updateTime = u_time * a_speed / 10.0;
  float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
  vec3 newPosition =
      vec3(position * (noise * pow(a_distort * 1., 2.0) + a_radius));

  // re: modelViewMatrix
  // https://threejs.org/docs/?q=webgl#api/en/renderers/webgl/WebGLProgram
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix *
                vec4(newPosition, 1.0);
}