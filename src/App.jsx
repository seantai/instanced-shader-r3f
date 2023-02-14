import "./css/App.css";
import { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Instance,
  Instances,
  MapControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Color, DynamicDrawUsage, MathUtils } from "three";
import { Perf } from "r3f-perf";
import frag from "./glsl/shader.frag";
import vert from "./glsl/shader.vert";

const Scene = () => {
  const ref = useRef();
  const { nodes, materials } = useGLTF("./Suz-transformed.glb");

  const { size } = useThree();
  const [mobile, setMobile] = useState();

  useEffect(() => {
    size.width < 550 ? setMobile(true) : setMobile(false);
  }, []);

  const count = mobile ? 100 : 200;

  const [a_distort, a_radius, a_speed] = useMemo(() => {
    const a_distort = new Float32Array(
      Array.from({ length: count }, () => Math.random() + 0.4)
    );
    const a_radius = new Float32Array(
      Array.from({ length: count }, () => Math.random() + 1)
    );
    const a_speed = new Float32Array(
      Array.from({ length: count }, () => Math.random() + 0.8)
    );
    return [a_distort, a_radius, a_speed];
  }, [count]);

  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        MathUtils.randFloatSpread(10),
        MathUtils.randFloatSpread(3),
        MathUtils.randFloatSpread(10),
      ],
      color: getRandomPastelColor(),
    }));
  }, [count]);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0,
      },
      u_texture: {
        value: materials.Suzanne.map,
      },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.uniforms.u_time.value = clock.elapsedTime;
    }
  });

  return (
    <>
      <ambientLight intensity={1.3} />
      <MapControls makeDefault zoomSpeed={0.33} />
      <OrthographicCamera
        zoom={200}
        up={[0, 0, 1]}
        near={0.0001}
        far={1000}
        rotation={[0, Math.PI, 0]}
      />
      <Instances
        ref={ref}
        limit={count}
        range={count}
        geometry={nodes.Suzanne.geometry}
      >
        <instancedBufferAttribute
          attach={"geometry-attributes-a_distort"}
          args={[a_distort, 1]}
          count={count}
          usage={DynamicDrawUsage}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-a_radius"}
          args={[a_radius, 1]}
          count={count}
          usage={DynamicDrawUsage}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-a_speed"}
          args={[a_speed, 1]}
          count={count}
          usage={DynamicDrawUsage}
        />
        <shaderMaterial
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
        />
        {data.map((data, i) => {
          return <Thing key={i} {...data} />;
        })}
      </Instances>
    </>
  );
};

function Thing(props) {
  const ref = useRef();
  return (
    <Instance
      ref={ref}
      {...props}
      onPointerEnter={(e) => {
        e.eventObject.scale.set(0, 0, 0);
        console.log("poof");
      }}
    />
  );
}

export default function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Scene />
        <Perf />
      </Canvas>
      <button
        onClick={() => {
          window.open(
            "https://github.com/seantai/instanced-shader-r3f",
            "_blank"
          );
        }}
      >
        {"</>"}
      </button>
    </>
  );
}

function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360); // 0 to 359
  const saturation = Math.floor(Math.random() * 30) + 70; // 70 to 100
  const lightness = Math.floor(Math.random() * 30) + 70; // 70 to 100
  const color = new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  return color;
}
