import { getEq } from 'fp-ts/lib/Array'
import { Eq, contramap, struct } from 'fp-ts/lib/Eq'
import { Eq as eqNumber } from 'fp-ts/lib/Number'

// const eqNumber: Eq<number> = {
//   equals: (x, y) => x === y,
// }
// Eq
function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some(item => E.equals(item, a))
}
elem(eqNumber)(5, [1, 2, 3, 4]) //false

//Eq-struct
interface Point {
  x: number
  y: number
}
const eqPoint1: Eq<Point> = {
  equals: (p1, p2) => p1 === p2 || (p1.x === p2.x && p1.y === p2.y)
}
// 同上
const eqPoint: Eq<Point> = struct({
  x: eqNumber,
  y: eqNumber
})
const points: Point[] = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 3, y: 2 }
]
function elemPoint<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some(item => E.equals(item, a))
}
eqPoint.equals({ x: 1, y: 1 }, { x: 1, y: 1 }) //true
elemPoint(eqPoint)({ x: 1, y: 3 }, points) //false

// Eq-getEq
const eqArrayOfPoints: Eq<Array<Point>> = getEq(eqPoint)
eqArrayOfPoints.equals([{ x: 1, y: 1 }], [{ x: 1, y: 1 }]) //true

// Eq-contramap  对照图
type User = {
  userId: number
  name: string
}
const eqUser = contramap((user: User) => user.userId)(eqNumber)
eqUser.equals({ userId: 1, name: 'Tom' }, { userId: 1, name: 'Tom Cat' }) // true
eqUser.equals({ userId: 1, name: 'Tom' }, { userId: 2, name: 'Tom' }) // false

export default function EqComponent() {
  return <div>Eq</div>
}
