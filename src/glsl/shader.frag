varying vec2 v_uv;
varying vec3 v_instanceColor;
uniform sampler2D u_texture;
uniform float u_time;

void main() {

  vec4 suzTexture = texture2D(u_texture, v_uv);
  vec4 final = vec4(v_instanceColor, 1.) * suzTexture;
  gl_FragColor = final;
}
