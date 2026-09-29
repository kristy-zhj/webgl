import { Either, chain, left, right, map, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

function stringify(...args: Parameters<typeof JSON.stringify>): Either<Error, string> {
  try {
    const stringified = JSON.stringify(...args)
    if (typeof stringified !== 'string') {
      throw new Error('Converting unsupported to JSON')
    }
    return right(stringified)
  } catch (error: any) {
    return left(error)
  }
}
stringify('abcd') //{_tag: 'Right', right: '"abcd"'}
const minLength = (s: string): Either<string, string> => (s.length >= 6 ? right(s) : left('at least 6 characters'))
const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left('at least one capital letter')
const oneNumber = (s: string): Either<string, string> => (/[0-9]/g.test(s) ? right(s) : left('at least one number'))
const validatePassword = (s: string): Either<string, string> => pipe(minLength(s), chain(oneCapital), chain(oneNumber))
validatePassword('Juice')
//{_tag: 'Left', left: 'at least 6 characters'}

pipe(
  validatePassword('Juice1'),
  map(e => console.log(e)), //Juice1
  match(
    e => console.log(e), //Juice  - at least 6 characters
    h => {}
  )
)
export default function EitherComponent() {
  return <div>Either</div>
}
