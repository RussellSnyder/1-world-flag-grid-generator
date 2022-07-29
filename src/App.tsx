import { useState } from 'react'
import './App.css'


interface Coordinate {
  x: number,
  y: number
}

interface GridProps {
  flagHeight: number
  flagPadding: number
  circlePoints: Coordinate[]
  circleSize: number
}

const Flag = ({circlePoints, circleSize, flagHeight, flagPadding}: GridProps) => {
  const centerSquareCells = Array(flagHeight).fill(null)

  const gridCells = centerSquareCells.map((_, rowIndex) => {
    return (
      <div key={`row-${rowIndex}`} className={`row ${rowIndex}`}>
        {centerSquareCells.map((_, cellIndex) => {
          const isCirclePoint = circlePoints.some(({x, y}) => y === rowIndex && x === cellIndex )

          return (
            <div key={`cell-${cellIndex}`} className={`cell${isCirclePoint ? ' circle' : ''}`} />
          )
        })}
      </div>
    )
  })

  const paddingCells = Array(flagPadding).fill(null).map((_, rowIndex) => (
    <div key={`padding-row-${rowIndex}`} className={`row ${rowIndex}`}>
      {centerSquareCells.map((_, cellIndex) => (
          <div key={`padding-cell-${cellIndex}`} className={`cell`} />
      ))}
    </div>

  ))

  return (
    <div className='grid'>{paddingCells} {gridCells} {paddingCells}</div>
  )
}



const getCoordinatesForACircle = (gridHeight: number, circleDiameter: number) => {
  let coordinates = new Set<Coordinate>()

  const centerOfCircle = Math.round(gridHeight / 2)
  
  // center row of the circle
  const centerLineOffset = centerOfCircle - circleDiameter / 2

  const radiusArray = Array(circleDiameter)

  radiusArray
    .fill({ y: centerOfCircle, x: null })
    .forEach((coord, i) => (coordinates.add({ ...coord, x: i + centerLineOffset })))

  const diameterLengths: number[] = []
  const r = circleDiameter / 2
  
  // now we need to determine the diameter lengths going up
  for (const [d, i] of radiusArray.fill(null).entries()) {
    if (i == 0) continue;
    const h = r - d

    if (h <= 0) {
      break
    }
  
    let c = Math.round(Math.sqrt(8 * h * (r - (h / 2))))
  
    // if the gridHeight is even, than diameter lengths should always be even
    if (gridHeight % 2 == 0 && c % 2 !== 0) {
      c -= 1
    }

    diameterLengths.push(c)
  }

  diameterLengths.forEach((diameter, i) => {
    const centerLineOffset = centerOfCircle - diameter / 2
    const yUp = centerOfCircle + i
    const yDown = centerOfCircle - i

    Array(diameter).fill(null)
      .forEach((_, i) => {
        coordinates.add({ y: yUp, x: Math.round(i + centerLineOffset) })
        coordinates.add({ y: yDown, x: Math.round(i + centerLineOffset) })
      })

  })

  return Array.from(coordinates)
}

function App() {
  const [flagHeight, setFlagHeight] = useState(120)

  const flagLength = Math.round(flagHeight * 1.5)
  const circleSize = Math.round(flagHeight * (3/5))

  // the flag will be a square without this
  const verticalPadding = Math.round((flagLength - flagHeight ) / 2)

  const circleCoordinates = getCoordinatesForACircle(flagHeight, circleSize)

  return (
    <div className="App">
      <h1 className='site-title no-print'>Earth Flag Helper</h1>
      <div className='controls no-print'>
        <label>
          <h3>
            Flag Height
          </h3>
          <input type="number" value={flagHeight} onChange={(e) => setFlagHeight(Number(e.currentTarget.value))} />
        </label>
        <label>
          <h3>
            Flag Length
          </h3>
          <input type="number" readOnly value={flagLength} />
        </label>
        <label>
          <h3>
            Circle Size
          </h3>
          <input type="number" readOnly value={circleSize} />
        </label>
      </div>
      <Flag
        flagPadding={verticalPadding}
        flagHeight={flagHeight}
        circleSize={circleSize}
        circlePoints={circleCoordinates}
      />
    </div>
  )
}

export default App
