import { Do, IO } from 'fp-ts/lib/IO'
import { Either } from 'fp-ts/Either'
// Task能够使用异步的副作用
// 网络不可达或者资源不存在，使用IOEither 和TaskEither
interface Task<A> {
  (): Promise<A>
}
interface IOEither<E, A> extends IO<Either<E, A>> {}
interface TaskEither<E, A> extends Task<Either<E, A>> {}
export default function TaskComponent() {
  return <div>Task</div>
}
