import { atom } from "jotai";
import { PostData } from "./utils/jotai";

const clockAtom = atom({
  light: false,
  lastUpdate: 0
})
const postId = atom(9001)

export {
  clockAtom,
  postId
}