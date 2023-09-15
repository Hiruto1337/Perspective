import { rotateX, rotateY, transform3Dto2D } from "./transformations";

interface Coordinate {
    x: number,
    y: number,
    z: number
}

// Graphical functions
export function drawPolygon(points: { x: number, y: number }[], ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    for (const { x, y } of points) {
        ctx.lineTo(x, y);
    }

    ctx.closePath();
    // ctx.strokeStyle = "#123456";
    ctx.stroke();
}

export function draw(polyhedron: Coordinate[][], roll: number, pitch: number, ctx: CanvasRenderingContext2D, WIDTH: number, HEIGHT: number, DISTANCE: number) {
    // Transform coordinates, convert them from 3D to 2D and scale and position them according to the canvas
    const polygon = polyhedron.map(points => points
        .map(point => rotateX(point, roll)) // Rotate points around x-axis
        .map(point => rotateY(point, pitch)) // Rotate points around y-axis
        .map(({ x, y, z }) => ({ x: x, y: y, z: z + DISTANCE })) // Push all points DISTANCE into the plane
        .map(({ x, y, z }) => ({ // Project the spatial (x, y, z)-coordinate into a planar (x, y)-coordinate
            x: transform3Dto2D(x, z),
            y: transform3Dto2D(y, z)
        }))
        .map(({ x, y }) => ({ // Scale and center with regards to canvas
            x: x * WIDTH + WIDTH / 2,
            y: y * HEIGHT + HEIGHT / 2
        }))
    )

    for (const face of polygon) {
        drawPolygon(face, ctx);
    }
}