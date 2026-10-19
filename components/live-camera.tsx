'use client'

import { useEffect, useRef } from 'react'

export function LiveCamera({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    let detach = () => {}

    const start = async () => {
      const { default: Hls } = await import('hls.js')
      if (cancelled || !videoRef.current) return
      if (Hls.isSupported()) {
        const player = new Hls()
        player.loadSource(src)
        player.attachMedia(videoRef.current)
        detach = () => player.destroy()
        return
      }
      if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = src
      }
    }

    start()
    return () => {
      cancelled = true
      detach()
    }
  }, [src])

  return <video className="live-camera-video" ref={videoRef} controls playsInline />
}
