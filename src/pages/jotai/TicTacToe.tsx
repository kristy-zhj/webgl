import { Provider, atom, useAtom } from 'jotai'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import '@assets/css/jotai/ticTacToe.css'

// prettier-ignore
const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
const squaresAtom = atom(Array(9).fill(null))

const nextValueAtom = atom(get =>
  get(squaresAtom).filter(r => r === 'O').length === get(squaresAtom).filter(r => r === 'X').length ? 'X' : 'O'
)
const winnerAtom = atom(get => {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (
      get(squaresAtom)[a] &&
      get(squaresAtom)[a] === get(squaresAtom)[b] &&
      get(squaresAtom)[a] === get(squaresAtom)[c]
    )
      return get(squaresAtom)[a]
  }
  return null
})
const resetSquaresAtom = atom(null, (_get, set) => set(squaresAtom, Array(9).fill(null)))
const selectSquareAtom = atom(
  get => get(squaresAtom),
  (get, set, square: number) => {
    if (get(winnerAtom) || get(squaresAtom)[square]) return
    set(
      squaresAtom,
      get(squaresAtom).map((sqr, sqrIndex) => (sqrIndex === square ? get(nextValueAtom) : sqr))
    )
  }
)
function Square({ i }: { i: number }) {
  const [squares, selectSquare] = useAtom(selectSquareAtom)
  return (
    <button
      className={`square ${squares[i]}`}
      onClick={() => {
        selectSquare(i)
      }}
    >
      {squares[i]}
    </button>
  )
}
const statusAtom = atom(get => {
  return get(winnerAtom)
    ? `Winner: ${get(winnerAtom)}`
    : get(squaresAtom).every(Boolean)
    ? `Scratch`
    : `Next player: ${get(nextValueAtom)}`
})
function Status() {
  const [gameStatus] = useAtom(statusAtom)
  const [, reset] = useAtom(resetSquaresAtom)
  return (
    <div className="status">
      <div className="message">{gameStatus}</div>
      <button onClick={() => reset()}>Reset</button>
    </div>
  )
}
function End() {
  const { width, height } = useWindowSize()
  const [gameWinner] = useAtom(winnerAtom)
  return (
    gameWinner && (
      <Confetti width={width} height={height} colors={[gameWinner === 'X' ? '#d76050' : '#509ed7', 'white']} />
    )
  )
}
export default function TicTacToe() {
  return (
    <Provider>
      <div className="game">
        <h1 className="title">
          x<span>o</span>x<span>o</span>
        </h1>
        <Status />
        <div className="board">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(field => (
            <Square key={field} i={field} />
          ))}
        </div>
      </div>
      <End />
    </Provider>
  )
}
