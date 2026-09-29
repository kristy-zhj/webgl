import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Link } from 'react-router-dom'
import m from '@routes/pathMap'

// 创建atom
const textAtom = atom('hello')
const countAtom = atom(10)
const uppercaseAtom = atom(get => get(textAtom).toUpperCase())

// atomWithStorage 此切换将通过 localStorage 在用户会话之间保留
const darkModelAtom = atomWithStorage('darkMode', false)
function ToggleDarkMode() {
  const [darkMode, setDarkMode] = useAtom(darkModelAtom)
  const toggleDarkMode = () => setDarkMode(!darkMode)
  return (
    <div>
      <h1>welcome to {darkMode ? 'dark' : 'light'} mode !</h1>
      <button onClick={toggleDarkMode}>toggle theme</button>
    </div>
  )
}

// useAtom
function Uppercase() {
  const [uppercase] = useAtom(uppercaseAtom)
  return <div>Uppercase:{uppercase}</div>
}

//创建一个atom from 多个atom
const count1 = atom(1)
const count2 = atom(2)
const count3 = atom(3)
const sum = atom(get => get(count1) + get(count2) + get(count3))

// 异步atoms
const urlAtom = atom('https://json.host.com')
const fetchUrlAtom = atom(async get => {
  const response = await fetch(get(urlAtom))
  return await response.json()
})
function Status() {
  const [json] = useAtom(fetchUrlAtom)
}

// 可写的atom
const decrementCountAtom = atom(
  get => get(countAtom),
  (get, set, _arg) => set(countAtom, get(countAtom) - 1)
)
function Counter() {
  const [count, decrement] = useAtom(decrementCountAtom)
  return (
    <>
      <div>{count}</div>
      <button onClick={decrement}>decrease</button>
    </>
  )
}

// 只写atoms
const multiplyCountAtom = atom(null, (get, set, by: number) => set(countAtom, get(countAtom) * by))
function Controls() {
  const [, multiply] = useAtom(multiplyCountAtom)
  return (
    <>
      <button onClick={() => multiply(3)}>triple</button>
    </>
  )
}

// 异步actions
const fetchCountAtom = atom(
  get => get(countAtom),
  async (_get, set, url: string) => {
    const response = await fetch(url)
    set(countAtom, (await response.json()).id)
  }
)
function AsyncControls() {
  const [count, compute] = useAtom(fetchCountAtom)
  return <button onClick={() => compute('https://hacker-news.firebaseio.com/v0/item/9001.json')}>compute</button>
}

export default function Jotai() {
  const [text, setText] = useAtom(textAtom)
  return (
    <>
      <div>jotai</div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <Uppercase />
      <ToggleDarkMode />
      <Counter />
      <Controls />
      <AsyncControls />
      <div>
        <Link to={m.jotai.clock.index}>clock</Link>
      </div>
      <div>
        <Link to={m.jotai.switchArticle}>switch-article</Link>
      </div>
      <div>
        <Link to={m.jotai.ticTacToe}>TicTacToe</Link>
      </div>
      <div>
        <Link to={m.jotai.atomFamily}>atom-family</Link>
      </div>
    </>
  )
}
