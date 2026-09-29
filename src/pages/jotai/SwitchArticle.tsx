import { postId } from '@/store'
import { PostData } from '@/utils/jotai'
import { Provider, atom, useAtom, useSetAtom } from 'jotai'
import { a, useSpring } from '@react-spring/web'
import Parser from 'html-react-parser'
import { Suspense } from 'react'

const postData = atom(async get => {
  const id = get(postId)
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  const data: PostData = await response.json()
  return data
})

function IdComponent() {
  const [id] = useAtom(postId)
  const props = useSpring({ from: { id }, id, rest: true })
  return <a.h1>{props.id.to(Math.round)}</a.h1>
}

function Next() {
  const setPostId = useSetAtom(postId)
  return (
    <button onClick={() => setPostId(id => id + 1)}>
      <div>→</div>
    </button>
  )
}

function PostTitle() {
  const [{ by, text, time, title, url }] = useAtom(postData)
  return (
    <>
      <h2>{by}</h2>
      <h6>{new Date(time * 1000).toLocaleDateString('en-US')}</h6>
      {title && <h4>{title}</h4>}
      {url && <a href={url}>{url}</a>}
      {text && <div>{Parser(text)}</div>}
    </>
  )
}

export default function SwitchArticle() {
  return (
    <Provider>
      <IdComponent />
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <PostTitle />
        </Suspense>
      </div>
      <Next />
    </Provider>
  )
}
