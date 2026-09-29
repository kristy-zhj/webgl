import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Spin } from 'antd'
import * as base64js from 'base64-js'
import { DateTime } from 'luxon'
import { FC, useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'

const serverUrl = '/camera'

type VideoData = {
  time: DateTime
  data: string
}

export const Camera: FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const webm9MimeCodec = 'video/webp; codecs="vp8, vp8l"'
  const [mediaSource] = useState(new MediaSource())
  const [connection, setConnection] = useState<null | HubConnection>(null)

  useEffect(() => {
    const connect = new HubConnectionBuilder().withUrl(serverUrl).build()
    setConnection(connect)
  }, [])

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Connected to SignalR hub')
        })
        .catch((error:any) => {
          console.error('Error connecting to SignalR hub:', error)
        })
      mediaSource.addEventListener('sourceopen', async () => {
        const sourceBuffer = mediaSource.addSourceBuffer(webm9MimeCodec)
        sourceBuffer.mode = 'sequence'

        connection!.on('camera', async (r: VideoData) => {
          const ba = base64js.toByteArray(r.data)
          console.log('camera ', r.time, ' ', ba.length)
          if (r.data.length === 0) {
            return
          }

          sourceBuffer.appendBuffer(ba)
        })
      })
    }
  }, [connection])

  useEffect(() => {
    videoRef.current!.src = URL.createObjectURL(mediaSource)
  }, [videoRef])

  return (
    <div>
      <video autoPlay muted={true} width={'100%'} height={'100%'} ref={videoRef}></video>
    </div>
  )
}
