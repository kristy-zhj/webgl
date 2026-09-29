import * as W from 'fp-ts/Writer'
import { Writer } from 'fp-ts/Writer'
import { Monoid } from 'fp-ts/Monoid'
// interface Writer<W, A> {
//   (): [A, W]
// }
interface User {
  name: string
  weight: number
}
// const isHeavy = (weight: number) => weight > 80
const isHeavy =
  (weight: number): Writer<string, boolean> =>
  () =>
    [weight > 80, '与80kg进行比较']
const getWeight =
  (user: User): Writer<string, number> =>
  () =>
    [user.weight, '取体重：']
let monoidString: Monoid<string> = {
  concat: (s, y) => s + y,
  empty: ''
}
const monad = W.getMonad(monoidString)
const user: User = { name: 'tom', weight: 81 }

// execute获得累积的额外信息
console.log(W.execute(monad.chain(getWeight(user), isHeavy))) //取体重: 与80kg进行比较。
// evaluate获得计算结果
console.log(W.evaluate(monad.chain(getWeight(user), isHeavy))) // true

export default function WriterComponent() {
  return <div>Writer</div>
}
