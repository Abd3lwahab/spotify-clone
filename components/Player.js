import { PlayIcon, PauseIcon } from '@heroicons/react/solid'
import {
  SwitchHorizontalIcon,
  RefreshIcon,
  RewindIcon,
  FastForwardIcon,
  VolumeUpIcon,
  VolumeOffIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'
import { debounce } from 'lodash'

function Player() {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const songInfo = useSongInfo()

  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const playerButtonStyle =
    'w-5 h-5  cursor-pointer hover:scale-125 transition tranform  duration-100 ease-out'

  const fetchCurrentTrack = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentTrackId(data.body?.item?.id)
    })

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      setIsPlaying(data.body?.is_playing)
    })
  }

  useEffect(() => {
    const setDeviceAvaliable = async () => {
      const devices = await spotifyApi.getMyDevices()
      if (devices.body.devices.length) {
        spotifyApi.transferMyPlayback([devices.body.devices[0].id], {
          play: isPlaying,
        })
      } else {
        throw new Error('No devices avaliable')
      }
    }

    setDeviceAvaliable()
  }, [])

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentTrack()
    }
  }, [spotifyApi, currentTrackId, session])

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debounceAdjustVolume(volume)
    }
  }, [volume])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)

    if (isPlaying) {
      spotifyApi.pause()
    } else {
      spotifyApi.play()
    }
  }

  const skipToNext = () => {
    spotifyApi.skipToNext().then(() => {
      fetchCurrentTrack()
    })
  }

  const skipToPrevious = () => {
    spotifyApi.skipToPrevious().then(() => {
      fetchCurrentTrack()
    })
  }

  const toggleVolume = () => {
    setVolume(volume === 0 ? 50 : 0)
  }

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume)
    }, 250),
    []
  )

  return (
    <div className="text-[#a3a3a3] grid grid-cols-3 gap-3 px-5 h-[90px] bg-[#0c0c0c] border-t-[0.1px] border-gray-900">
      <div className="flex items-center">
        <img
          src={songInfo?.album.images[2].url}
          className="w-14 mr-5 shadow-2xl hidden md:inline-flex"
        />
        <div className="flex flex-col min-w-0">
          <p className="text-white truncate text-sm">{songInfo?.name}</p>
          <p className="truncate text-xs">
            {songInfo?.artists.map((artist) => artist.name).join(', ')}
          </p>
        </div>
      </div>
      <div className="flex justify-evenly items-center">
        <SwitchHorizontalIcon className={`hidden sm:inline-block ${playerButtonStyle}`} />
        <RewindIcon
          className={`hidden sm:inline-block ${playerButtonStyle}`}
          onClick={skipToPrevious}
        />
        <button onClick={() => togglePlay()}>
          {isPlaying ? (
            <PauseIcon className={`${playerButtonStyle} w-11 h-11 text-white`} />
          ) : (
            <PlayIcon className={`${playerButtonStyle} w-11 h-11 text-white`} />
          )}
        </button>
        <FastForwardIcon
          className={`hidden sm:inline-block ${playerButtonStyle}`}
          onClick={skipToNext}
        />
        <RefreshIcon className={`hidden sm:inline-block ${playerButtonStyle}`} />
      </div>
      <div className="flex justify-end items-center space-x-2 sm:space-x-3">
        <button onClick={toggleVolume}>
          {volume === 0 ? (
            <VolumeOffIcon className={`${playerButtonStyle}`} />
          ) : (
            <VolumeUpIcon className={`${playerButtonStyle}`} />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          className="h-1 w-20 sm:w-24 rounded-lg"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default Player
