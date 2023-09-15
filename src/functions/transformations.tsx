interface Coordinate {
    x: number,
    y: number,
    z: number
}

const ANGLE = 45;
const RADIANS = (ANGLE / 180) * Math.PI;

export function rotateX({ x, y, z }: Coordinate, angle: number): Coordinate {
    return {
        x,
        y: y * Math.cos(angle) - z * Math.sin(angle),
        z: y * Math.sin(angle) + z * Math.cos(angle)
    }
}

export function rotateY({ x, y, z }: Coordinate, angle: number): Coordinate {
    return {
        x: x * Math.cos(angle) + z * Math.sin(angle),
        y,
        z: x * (-Math.sin(angle)) + z * Math.cos(angle)
    }
}

export function rotateZ({x, y, z}: Coordinate, angle: number): Coordinate {
    return {
        x: x * Math.cos(angle) - y * Math.sin(angle),
        y: x * Math.sin(angle) + y * Math.cos(angle),
        z: z
    }
}

export function rotate3D({ x, y, z }: Coordinate, pitch: number, yaw: number, roll: number): Coordinate {
    return {
        x: (
            x * Math.cos(yaw) * Math.cos(pitch) +
            y * (Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll) - Math.sin(yaw) * Math.cos(roll)) +
            z * (Math.cos(yaw) * Math.sin(pitch) * Math.cos(roll) + Math.sin(yaw) * Math.sin(roll))
        ),
        y: (
            x * Math.sin(yaw) * Math.cos(pitch) +
            y * (Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll) + Math.cos(yaw) * Math.cos(roll)) +
            z * (Math.sin(yaw) * Math.sin(pitch) * Math.cos(roll) - Math.cos(yaw) * Math.sin(roll))
        ),
        z: (
            x * (-Math.sin(pitch)) +
            y * Math.cos(pitch) * Math.sin(roll) +
            z * Math.cos(pitch) * Math.cos(roll)
        )
    }
}

export function transform3Dto2D(xy: number, z: number): number {
    return xy / (z * Math.tan(RADIANS / 2));
}