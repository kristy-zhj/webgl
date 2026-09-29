import { Do, IO } from 'fp-ts/lib/IO'
import { chain, map } from 'fp-ts/IO'
import { pipe } from 'fp-ts/lib/function'
// IO也有Functor、Monad等typeClass的实例,可以使用map chain
// 以pure的方式使用同步产生的副作用的能力
const getRoot: IO<HTMLElement> = () => document.documentElement
const calcWidth = (elm: HTMLElement) => elm.clientWidth
const main: IO<void> = pipe(
  Do,
  chain(() => getRoot),
  map(calcWidth),
  chain(a => () => console.log(a))
)
// const log =
//   <A>(a: A): IO<void> =>
//   () =>
//     console.log(a);
main()
export default function IOComponent() {
  return <div>IO</div>
}
