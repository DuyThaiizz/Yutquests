"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform vec2 pointer;
  uniform float time;
  uniform float energy;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec3 starLayer(vec2 uv, float scale, float drift, vec3 tint) {
    vec2 grid = uv * scale + pointer * drift;
    vec2 cell = floor(grid);
    vec2 local = fract(grid) - 0.5;
    float seed = hash(cell);
    vec2 offset = vec2(hash(cell + 3.17), hash(cell + 8.41)) - 0.5;
    float distanceToStar = length(local - offset * 0.72);
    float size = mix(0.018, 0.052, seed * seed);
    float star = smoothstep(size, 0.0, distanceToStar);
    float twinkle = 0.72 + 0.28 * sin(time * (0.5 + seed) + seed * 18.0);
    float rare = step(0.82, seed);
    return tint * star * twinkle * rare;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.x *= resolution.x / resolution.y;
    vec3 cream = vec3(0.955, 0.925, 0.835);
    vec3 navy = vec3(0.025, 0.115, 0.19);
    vec3 blue = vec3(0.03, 0.38, 0.63);
    vec3 gold = vec3(0.78, 0.55, 0.16);
    vec3 stars = starLayer(uv, 12.0, 0.08, navy);
    stars += starLayer(uv + vec2(time * 0.004, 0.0), 20.0, -0.06, blue) * 0.72;
    stars += starLayer(uv - vec2(0.0, time * 0.003), 28.0, 0.04, gold) * (0.55 + energy * 1.8);
    float vignette = smoothstep(1.0, 0.1, distance(uv, vec2(0.72, 0.48)));
    vec3 color = cream + stars * (0.44 + vignette * 0.56);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function StarlightField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "resolution");
    const pointerUniform = gl.getUniformLocation(program, "pointer");
    const timeUniform = gl.getUniformLocation(program, "time");
    const energyUniform = gl.getUniformLocation(program, "energy");
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let energy = 0;
    let visible = true;
    let frame = 0;
    let started = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      resize();
      pointer.x += (target.x - pointer.x) * 0.065;
      pointer.y += (target.y - pointer.y) * 0.065;
      energy *= 0.94;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(pointerUniform, pointer.x, pointer.y);
      gl.uniform1f(timeUniform, (now - started) / 1000);
      gl.uniform1f(energyUniform, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (visible && !reducedMotion && !document.hidden)
        frame = requestAnimationFrame(render);
    };

    const onPointer = (event: PointerEvent) => {
      target.x = event.clientX / window.innerWidth - 0.5;
      target.y = 0.5 - event.clientY / window.innerHeight;
    };
    const onThrow = () => {
      energy = 1;
      started = performance.now() - 900;
      if (!frame && visible && !reducedMotion)
        frame = requestAnimationFrame(render);
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else if (visible && !reducedMotion) frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(render);
      } else cancelAnimationFrame(frame);
    });

    observer.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("yutquest:throw", onThrow);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("yutquest:throw", onThrow);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <canvas aria-hidden="true" className="starlight-field" ref={canvasRef} />
  );
}
