import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import Stroke from './Stroke'
import {
  BACKGROUND,
  STROKE_ATTEMPTS,
  FLOW_FIDELITY,
  LENGTH_VARIATION,
  MAX_LENGTH,
  MIN_LENGTH,
  DOT_ATTEMPTS,
  AVOIDANCE_THRESHOLD,
  MIN_DOT_RADIUS,
  MAX_DOT_RADIUS,
} from './constants'
import Dot from './Dot'

export enum Seeds {
  Flow,
  Position,
  Length,
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)
  c.lineCap = 'round'
  c.lineWidth = 1

  const getFlowAngle = (stroke: Stroke): number => {
    const noiseX = map(stroke.pos.x, 0, width, 0, FLOW_FIDELITY, true)
    const noiseY = map(stroke.pos.y, 0, height, 0, FLOW_FIDELITY, true)

    return map(
      simplex[Seeds.Flow].noise3D(noiseX, noiseY, noiseStart * 0.1),
      -1,
      1,
      -Math.PI,
      Math.PI * 3
    )
  }

  const getRandomLength = (a: number, b: number) =>
    map(randomFromNoise(simplex[Seeds.Position].noise2D(a, b)), 0, 1, 0, width)
  const getRandomPos = (i: number): Vector2 =>
    new Vector2(
      getRandomLength(Math.PI, i * 5),
      getRandomLength(i * 5, Math.PI)
    )

  c.save()

  const strokes: Stroke[] = []
  for (let i = 0; i < STROKE_ATTEMPTS; i++) {
    const strokeLength = map(
      simplex[Seeds.Length].noise2D(i * 5, Math.PI * 2),
      -1,
      1,
      MAX_LENGTH,
      MAX_LENGTH - LENGTH_VARIATION
    )

    const stroke = new Stroke({
      i,
      pos: getRandomPos(i),
    })

    for (let t = 0; t < strokeLength; t++) {
      if (stroke.canDraw(strokes)) {
        stroke.update(getFlowAngle(stroke))
      }
    }

    if (stroke.length > MIN_LENGTH) {
      stroke.draw(c)
      strokes.push(stroke)
    }
  }

  const dots: Dot[] = []
  for (let i = 0; i < DOT_ATTEMPTS; i++) {
    const pos = getRandomPos(i + STROKE_ATTEMPTS)

    const [strokeDistance, strokeIndex] = strokes.reduce(
      ([dist, i], stroke, strokeI) => {
        const strokeDist = stroke.shortestDistToPos(pos)
        if (strokeDist < dist) return [strokeDist, strokeI]
        return [dist, i]
      },
      [Infinity, i]
    )

    const obstacleDistance = dots.reduce(
      (curr, dot) => Math.min(curr, pos.dist(dot.pos) - dot.radius),
      strokeDistance
    )

    if (
      obstacleDistance > AVOIDANCE_THRESHOLD + MIN_DOT_RADIUS
    ) {
      const dot = new Dot({
        pos,
        radius: Math.min(obstacleDistance - AVOIDANCE_THRESHOLD, MAX_DOT_RADIUS),
        color: strokes[strokeIndex].color,
      })
      dot.draw(c)
      dots.push(dot)
    }
  }

  c.restore()
}
