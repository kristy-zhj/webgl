import { Radio } from 'antd'
import { Provider, atom, useAtom, useSetAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { CloseOutlined } from '@ant-design/icons'
import { a, useTransition } from '@react-spring/web'
import { FormEvent } from 'react'
import { nanoid } from 'nanoid'

type Param = { id: string; title?: string }
const todoAtomFamily = atomFamily(
  (param: Param) => atom({ title: param.title || 'No title', completed: false }),
  (a: Param, b: Param) => a.id === b.id
)
// 单选状态
const filterAtom = atom('all')
// 输入列表值的id
const todosAtom = atom<string[]>([])
// 根据单选的状态，修改todoAtomFamily的completed的值
const filteredAtom = atom(get => {
  const filter = get(filterAtom)
  const todos = get(todosAtom)
  if (filter === 'all') return todos
  else if (filter === 'completed') return todos.filter(id => get(todoAtomFamily({ id })).completed)
  else return todos.filter(id => !get(todoAtomFamily({ id })).completed)
})

const Filter = () => {
  const [filter, set] = useAtom(filterAtom)
  return (
    <Radio.Group onChange={e => set(e.target.value)} value={filter}>
      <Radio value="all">All</Radio>
      <Radio value="completed">Completed</Radio>
      <Radio value="incompleted">Incompleted</Radio>
    </Radio.Group>
  )
}
// 根据单选状态显示收起输入列表项
const Filtered = ({ remove }: { remove: (id: string) => void }) => {
  const [todos] = useAtom(filteredAtom)
  const transitions = useTransition(todos, {
    keys: (id: string) => id,
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 40 },
    leave: { opacity: 0, height: 0 }
  })
  return transitions((style, id) => (
    <a.div className="item" style={style}>
      <TodoItem id={id} remove={remove} />
    </a.div>
  ))
}
// 输入列表项
const TodoItem = ({ id, remove }: { id: string; remove: (id: string) => void }) => {
  const [item, setItem] = useAtom(todoAtomFamily({ id }))
  const toggleCompleted = () => setItem({ ...item, completed: !item.completed })
  return (
    <>
      <input type="checkbox" checked={item.completed} onChange={toggleCompleted} />
      <span style={{ textDecoration: item.completed ? 'line-through' : '' }}>{item.title}</span>
      <CloseOutlined onClick={() => remove(id)} />
    </>
  )
}
// 输入列表
const TodoList = () => {
  const setTodos = useSetAtom(todosAtom)
  const remove = (id: string) => {
    setTodos(prev => prev.filter(item => item !== id))
    todoAtomFamily.remove({ id })
  }
  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = e.currentTarget.inputTitle.value
    e.currentTarget.inputTitle.value = ''
    const id = nanoid()
    todoAtomFamily({ id, title })
    setTodos(prev => [...prev, id])
  }
  return (
    <form onSubmit={add}>
      <Filter />
      <input name="inputTitle" placeholder="Type ..." />
      <Filtered remove={remove} />
    </form>
  )
}
// 存入localStorage的serializeAtom
const serializeAtom = atom<
  null,
  { type: 'serialize'; callback: (value: string) => void } | { type: 'deserialize'; value: string }
>(null, (get, set, action) => {
  if (action.type === 'serialize') {
    const todos = get(todosAtom)
    const todoMap: Record<string, { title: string; completed: boolean }> = {}
    todos.forEach(id => {
      todoMap[id] = get(todoAtomFamily({ id }))
    })
    const obj = {
      todos,
      todoMap,
      filter: get(filterAtom)
    }
    action.callback(JSON.stringify(obj))
  } else if (action.type === 'deserialize') {
    const obj = JSON.parse(action.value)
    set(filterAtom, obj.filter)
    obj.todos.forEach((id: string) => {
      const todo = obj.todoMap[id]
      set(todoAtomFamily({ id, ...todo }), todo)
    })
    set(todosAtom, obj.todos)
  }
})
// 存入读取 localStorage
const Persist = () => {
  const [, dispatch] = useAtom(serializeAtom)
  const save = () => {
    dispatch({
      type: 'serialize',
      callback: value => {
        localStorage.setItem('serializedTodos', value)
      }
    })
  }
  const load = () => {
    const value = localStorage.getItem('serializedTodos')
    if (value) {
      dispatch({ type: 'deserialize', value })
    }
  }
  return (
    <>
      <button onClick={save}>Save to localStorage</button>
      <button onClick={load}>Load from localStorage</button>
    </>
  )
}
export default function AtomFamily() {
  return (
    <>
      <Provider>
        <h1>Jotai</h1>
        <TodoList />
        <h3>persist</h3>
        <Persist />
      </Provider>
    </>
  )
}
