import { Reader, ask, chain, map } from 'fp-ts/Reader'
import { flow, pipe } from 'fp-ts/lib/function'

// interface Reader<R, A> {
//   (r: R): A
// }

// flow  pipe
const len = (s: string): number => s.length
const double = (n: number): number => n * 2
const gt2 = (n: number): boolean => n > 2
flow(len, double, gt2)('abc') //true
// equivalent to
pipe('abc', len, double, gt2) //true

// 把Dependencies这个参数移出成为独立的参数
interface Dependencies {
  i18n: {
    true: string
    false: string
  }
  lowerBound: number
}
const instance: Dependencies = {
  i18n: {
    true: 'vero',
    false: 'falso'
  },
  lowerBound: 2
}
const f =
  (b: boolean): Reader<Dependencies, string> =>
  deps =>
    b ? deps.i18n.true : deps.i18n.false
const g = (n: number): Reader<Dependencies, string> => f(n > 2)
const h = (s: string): Reader<Dependencies, string> => g(s.length + 1)

// ask读取lowerBound
const gg = (n: number): Reader<Dependencies, string> =>
  pipe(
    ask<Dependencies>(),
    chain(deps => f(n > deps.lowerBound))
  )
const hh = (s: string): Reader<Dependencies, string> => gg(s.length + 1)
h('foo')(instance) // 'vero'
hh('foo')({ ...instance, lowerBound: 4 }) // 'falso'

export default function ReaderComponent() {
  return <div>Reader</div>
}
