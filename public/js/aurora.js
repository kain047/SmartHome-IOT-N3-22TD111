// Aurora background using OGL (no React)
import { Renderer, Program, Mesh, Color, Triangle } from "https://cdn.skypack.dev/ogl";

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

// Simplex noise
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,
                    -0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*0.0243902439)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.7928429-0.8537347*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  uv.y = 1.0 - uv.y; // đảo trục y cho chuẩn hướng

  // Gradient ánh sáng ở giữa, nền đen phía dưới
  float noise = snoise(vec2(uv.x * 4.0, uTime * 0.15)) * 0.2;
  float wave = smoothstep(0.2, 0.8, uv.y + noise * uAmplitude);

  // Màu Aurora (xanh lá – tím – xanh dương)
  vec3 color = mix(vec3(0.0), vec3(0.2, 1.0, 0.8), wave);
  color = mix(color, vec3(0.7, 0.2, 1.0), uv.x);
  color *= smoothstep(0.05, 0.5, uv.y); // fade dưới cùng

  fragColor = vec4(color, 1.0);
}
`;

function startAurora(container, {
  colorStops = ["#5227FF", "#7CFF67", "#5227FF"],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0
} = {}) {
  const renderer = new Renderer({ alpha: true });
  const gl = renderer.gl;
  gl.clearColor(0,0,0,0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) delete geometry.attributes.uv;

  const program = new Program(gl, {
    vertex: VERTEX_SHADER,
    fragment: FRAGMENT_SHADER,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: amplitude },
      uBlend: { value: blend },
      uResolution: { value: [container.offsetWidth, container.offsetHeight] },
      uColorStops: {
        value: colorStops.map(hex => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        })
      }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });
  container.appendChild(gl.canvas);

  const resize = () => {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    program.uniforms.uResolution.value = [container.offsetWidth, container.offsetHeight];
  };
  window.addEventListener("resize", resize);
  resize();

  let t = 0;
  const loop = () => {
    requestAnimationFrame(loop);
    t += 0.016;
    program.uniforms.uTime.value = t * speed;
    renderer.render({ scene: mesh });
  };
  loop();
}

window.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("aurora-bg");
  if (el) startAurora(el);
});
