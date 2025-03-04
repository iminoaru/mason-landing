'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

const SEPARATION = 70
const AMOUNTX = 40
const AMOUNTY = 40

const vertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform vec3 color;
  uniform float time;
  varying vec3 vPosition;
  
  void main() {
    float opacity = 0.2 + 0.3 * sin(vPosition.x * 0.02 + time);
    vec3 finalColor = color * (0.8 + 0.2 * sin(vPosition.z * 0.01 + time * 0.5));
    gl_FragColor = vec4(finalColor, opacity);
  }
`

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshRef = useRef<THREE.LineSegments | null>(null)
  const frameRef = useRef<number | null>(null)
  const mouseX = useRef<number>(0)
  const mouseY = useRef<number>(0)
  const windowHalfX = useRef<number>(0)
  const windowHalfY = useRef<number>(0)
  const countRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    const init = () => {
      sceneRef.current = new THREE.Scene()
      cameraRef.current = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
      cameraRef.current.position.z = 1500
      cameraRef.current.position.y = -100

      const geometry = new THREE.BufferGeometry()
      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x7b2fff) },
          time: { value: 0 }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        wireframe: true,
        blending: THREE.AdditiveBlending
      })

      const vertices = []
      const indices = []
      
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2)
          const z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2)
          vertices.push(x, 0, z)

          if (ix < AMOUNTX - 1 && iy < AMOUNTY - 1) {
            const currentIndex = ix * AMOUNTY + iy
            indices.push(currentIndex, currentIndex + 1)
            indices.push(currentIndex, currentIndex + AMOUNTY)
          }
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      geometry.setIndex(indices)

      meshRef.current = new THREE.LineSegments(geometry, material)
      meshRef.current.position.y = -400
      meshRef.current.rotation.x = 0.2
      sceneRef.current.add(meshRef.current)

      rendererRef.current = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
      })
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      containerRef.current?.appendChild(rendererRef.current.domElement)

      windowHalfX.current = window.innerWidth / 2
      windowHalfY.current = window.innerHeight / 2
    }

    const onWindowResize = () => {
      windowHalfX.current = window.innerWidth / 2
      windowHalfY.current = window.innerHeight / 2

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return
      mouseX.current = event.clientX - windowHalfX.current
      mouseY.current = event.clientY - windowHalfY.current
    }

    const render = () => {
      if (!cameraRef.current || !sceneRef.current || !meshRef.current || !rendererRef.current) return

      cameraRef.current.position.x += (mouseX.current - cameraRef.current.position.x) * 0.01
      cameraRef.current.lookAt(sceneRef.current.position)

      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      const material = meshRef.current.material as THREE.ShaderMaterial
      
      timeRef.current += 0.01
      material.uniforms.time.value = timeRef.current

      let i = 1
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = (Math.sin((ix + countRef.current) * 0.2) * 50) +
            (Math.sin((iy + countRef.current) * 0.3) * 50)
          i += 3
        }
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      countRef.current += 0.02
    }

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      render()
    }

    init()
    animate()

    window.addEventListener('resize', onWindowResize)
    if (containerRef.current) {
      containerRef.current.style.touchAction = 'none'
      containerRef.current.addEventListener('pointermove', onPointerMove)
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('resize', onWindowResize)
      containerRef.current?.removeEventListener('pointermove', onPointerMove)
      
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        ;(meshRef.current.material as THREE.Material).dispose()
      }
    }
  }, [])

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#0a0014] via-[#120029] to-[#1a0033]">
      <div ref={containerRef} className="absolute inset-0" />
      
      <div className="relative z-10 h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to the Future
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Experience the next generation of digital innovation where imagination meets technology.
          </motion.p>

          <motion.div 
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border border-purple-400 text-purple-400 font-medium hover:bg-purple-400/10 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-8 left-8 md:left-16 lg:left-24 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Powered by{' '}
          <a href="https://threejs.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
            Three.js
          </a>
        </motion.div>
      </div>
    </main>
  )
}
