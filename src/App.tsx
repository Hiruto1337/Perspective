import { useEffect, useRef, useState } from 'react';
import './App.css';
import { rotateY } from './functions/transformations';
import { draw } from './functions/drawings';

const WIDTH = 600;
const HEIGHT = 600;
const DISTANCE = 5;

interface Coordinate {
    x: number,
    y: number,
    z: number
}

const cube: Coordinate[][] = [
    // Top
    [
        { x: -0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: -0.5, z: 0.5 },
        { x: -0.5, y: -0.5, z: 0.5 },
    ],
    // Bottom
    [
        { x: -0.5, y: 0.5, z: -0.5 },
        { x: 0.5, y: 0.5, z: -0.5 },
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: -0.5, y: 0.5, z: 0.5 },
    ],
    // Front
    [
        { x: -0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: 0.5, z: -0.5 },
        { x: -0.5, y: 0.5, z: -0.5 },
    ],
    // Back
    [
        { x: -0.5, y: -0.5, z: 0.5 },
        { x: 0.5, y: -0.5, z: 0.5 },
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: -0.5, y: 0.5, z: 0.5 },
    ],
];

const unitVectors: Coordinate[][] = [
    // Unit vector i
    [
        { x: 0, y: 0, z: 0 },
        { x: 0.25, y: 0, z: 0 }
    ],
    // Unit vector j
    [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: -0.25, z: 0 }
    ],
    // Unit vector k
    [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0.25 }
    ],
];

function createPolyhedron(radius: number, resolution: number, offset: {x: number, y: number, z: number}): Coordinate[][] {
    let angleIncrement = 2 * Math.PI / resolution;

    // Create a plane
    let plane: Coordinate[] = [];
    for (let i = 0; i < resolution; i++) {
        plane.push({
            x: radius * Math.cos(i * angleIncrement),
            y: radius * Math.sin(i * angleIncrement),
            z: 0
        });
    }

    // Create an array of planes, each plane rotated
    let planes: Coordinate[][] = [];

    // Rotate each plane by a multiple of angleIncrement
    for (let i = 0; i < resolution / 2; i++) {
        planes.push(plane.map(({ x, y, z }) => rotateY({ x, y, z }, angleIncrement * i)).map(({x, y, z}) => ({x: x + offset.x, y: y + offset.y, z: z + offset.z})));
    }

    return planes;
}

// function getElectron(nucleus: Coordinate): Coordinate {
//     // Ψ_s1(r) = (1/√π) * (1/a0)^(3/2) * e^(-r/a0)
//     // |Ψ_s1(r)|^2 = 1/(πa0^3) * e^(-2r/a0)
//     // |Ψ_s1(r)|^2_norm = 1/(πa0^3) * e^(-2r/a0)
// }

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [clickPos, setClickPos] = useState([0, 0]);

    const [prevRoll, setPrevRoll] = useState(0);
    const [prevPitch, setPrevPitch] = useState(0);

    const [roll, setRoll] = useState(0); // x-axis rotation
    const [pitch, setPitch] = useState(0); // y-axis rotation

    // Particle position
    const [ballX, setBallX] = useState(0);
    const [ballY, setBallY] = useState(0);
    const [ballZ, setBallZ] = useState(0);

    // Particle velocity
    const [ballVX, setBallVX] = useState(Math.random() * 0.01);
    const [ballVY, setBallVY] = useState(Math.random() * 0.01);
    const [ballVZ, setBallVZ] = useState(Math.random() * 0.01);

    function updatePosition(pos: number, setPos: React.Dispatch<React.SetStateAction<number>>, vel: number, setVel: React.Dispatch<React.SetStateAction<number>>) {
        if (0.5 <= Math.abs(pos) + Math.abs(vel) + 0.05) {
            setPos(prev => prev - vel);
            setVel(prev => -prev);
        } else {
            setPos(prev => prev + vel);
        }
    }

    function tick() {
        updatePosition(ballX, setBallX, ballVX, setBallVX);
        updatePosition(ballY, setBallY, ballVY, setBallVY);
        updatePosition(ballZ, setBallZ, ballVZ, setBallVZ);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        draw(unitVectors, roll, pitch, ctx, WIDTH, HEIGHT, DISTANCE);
        draw(createPolyhedron(0.05, 16, {x: ballX, y: ballY, z: ballZ}), roll, pitch, ctx, WIDTH, HEIGHT, DISTANCE);
        draw(cube, roll, pitch, ctx, WIDTH, HEIGHT, DISTANCE);

        let timeout = setTimeout(() => tick(), 16);

        return () => clearTimeout(timeout);
    }, [ballX, ballY, ballZ, roll, pitch]);

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh" }}>
            <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                style={{ border: "1px solid black" }}
                onMouseDown={e => {
                    setMouseDown(true);
                    setClickPos([e.clientX, e.clientY]);
                    setPrevRoll(roll);
                    setPrevPitch(pitch);
                }}
                onMouseUp={() => setMouseDown(false)}
                onMouseMove={e => {
                    if (!mouseDown) return;
                    setPitch(prevPitch + (clickPos[0] - e.clientX) * 0.05);
                    setRoll(prevRoll - (clickPos[1] - e.clientY) * 0.05);
                }}
            />
        </div>
    );
}

export default App;
