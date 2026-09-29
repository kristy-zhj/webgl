import { Eq } from 'fp-ts/lib/Eq'
import { contramap, fromCompare, reverse, Ord } from 'fp-ts/lib/Ord'

// Ord-支持比较操作的类型
type Ordering = -1 | 0 | 1
// interface Ord<A> extends Eq<A> {
//   readonly compare: (x: A, y: A) => Ordering
// }
const ordNumber1: Ord<number> = {
  equals: (x, y) => x === y,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
}
ordNumber1.compare(1, 2) //-1

// Ord-fromCompare
const ordNumber: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0))
ordNumber.compare(2, 1) //1
function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x, y) => (O.compare(x, y) === 1 ? y : x)
}
min(ordNumber)(2, 1) //1

// Ord-contramap 对比图
type User = {
  name: string
  age: number
}
const byAge1: Ord<User> = fromCompare((x, y) => ordNumber.compare(x.age, y.age))
// 同上
const byAge: Ord<User> = contramap((user: User) => user.age)(ordNumber)
const getYounger = min(byAge)
getYounger({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) //{ name: 'Giulio', age: 45 }

// Ord-reverse :颠倒
function max<A>(O: Ord<A>): (x: A, y: A) => A {
  return min(reverse(O))
}
const getOlder = max(byAge)
getOlder({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // { name: 'Guido', age: 48 }

export default function OrdComponent() {
  return <div>Ord</div>
}
