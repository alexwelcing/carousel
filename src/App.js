import * as THREE from 'three'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Billboard, Text } from '@react-three/drei'
import { suspend } from 'suspend-react'
import { easing, geometry } from 'maath'
import VideoPlayer from './Components/VideoPlayer'
import cardData from './data.json'

extend(geometry)
const inter = import('@pmndrs/assets/fonts/inter_regular.woff')

function App() {
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const handleVideoSelect = (videoId) => {
    setSelectedVideoId(videoId);
  };

  return (
    <Canvas dpr={[1, 1.5]}>
      <ScrollControls pages={4} infinite>
      <Scene position={[0, 1.5, 0]} handleVideoSelect={handleVideoSelect} />
      </ScrollControls>
      {selectedVideoId && <VideoPlayer videoId={selectedVideoId} />}
    </Canvas>
  );
}

function Scene({ children, ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const [hovered, hover] = useState(null)
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9], 0.3, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return (
    <group ref={ref} {...props}>
      {cardData.map((card, i) => {
        const angle = from + (i / cardData.length) * len;

        return (
          <Card
          key={angle}
          onPointerOver={(e) => (e.stopPropagation(), hover(i))}
          onPointerOut={() => (hover(null))}
          onClick={() => handleVideoSelect(card.videoId)} // Use the videoId from the card object
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
            url={`/${card.image}`} // Use the image filename from the card object
          >
            <Text font={suspend(inter).default} fontSize={0.25} anchorX="center" color="black">
              {card.artist} - {card.song} {/* Display artist and song */}
            </Text>
          </Card>
        )
      })}
      <ActiveCard hovered={hovered} />
    </group>
  )
}

const from = 0 // Define from
const len = 0 // Define len
const radius = 0 // Define radius

function Card({ url, active, hovered, onPointerOver, onPointerOut, ...props }) {
  const ref = useRef();
  useFrame((state, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1;
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta);
    easing.damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta);
  });

  return (
    <group {...props} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <Image ref={ref} url={url} scale={[1.618, 1, 1]} side={THREE.DoubleSide} />
    </group>
  );
}

function ActiveCard({ hovered, ...props }) {
  const ref = useRef();
  const card = useMemo(() => {
    if (hovered !== null && cardData[hovered]) {
      return cardData[hovered];
    }
    return null;
  }, [hovered]);

  useLayoutEffect(() => {
    if (ref.current && ref.current.material) {
      ref.current.material.zoom = 0.8;
    }
  }, [hovered]);

  useFrame((state, delta) => {
    if (ref.current && ref.current.material) {
      easing.damp(ref.current.material, 'zoom', 1, 0.5, delta);
      easing.damp(ref.current.material, 'opacity', hovered !== null, 0.3, delta);
    }
  });

  return (
    <Billboard {...props}>
      {card && (
        <>
          <Text font={suspend(inter).default} fontSize={0.5} position={[2.15, 3.85, 0]} anchorX="left" color="black">
            {`${card.artist} - ${card.song}`}
          </Text>
          {ref.current && ref.current.material && (
            <Image transparent position={[0, 1.5, 0]} url={`${card.image}`}>
              <roundedPlaneGeometry parameters={{ width: 3.5, height: 1.618 * 3.5 }} args={[3.5, 1.618 * 3.5, 0.2]} />
            </Image>
          )}
        </>
      )}
    </Billboard>
  );
}

export default App
