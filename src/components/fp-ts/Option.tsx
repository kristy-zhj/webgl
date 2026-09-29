import * as O from 'fp-ts/Option'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'

// Option Option.chain
interface User {
  name: string
  age: number
  image?: {
    url: string
  }
}
interface User1 {
  name: string
  age: number
  image: Option<{
    url: string
  }>
}
function foo(currentUser: Option<User>) {
  return pipe(
    currentUser,
    O.map(user => user.name),
    O.toUndefined,
  )
}
function foo1(currentUser: Option<User1>) {
  return pipe(
    currentUser,
    O.chain(u =>
      pipe(
        u.image,
        O.map(i => i.url),
      ),
    ),
  )
}
export default function OptionComponent() {
  return <div>Option</div>
}
