import { useSession } from 'next-auth/react'
import { ChevronDownIcon, UserIcon } from '@heroicons/react/outline'
import { shuffle } from 'lodash'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { playlistIdState, playlistState } from '../atoms/playlitsAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

function Center() {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    if (playlistId) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((res) => {
          setPlaylist(res.body)
          console.log(res.body)
        })
        .catch((err) => {
          console.log('Somthing Went Wrong!', err)
        })
    }
  }, [spotifyApi, playlistId])

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-5 hidden sm:block">
        <div className="flex items-center bg-[#000000b3] opacity-90 hover:bg-[#282828] space-x-3 text-white rounded-full cursor-pointer pr-2 p-[2px]">
          {session?.user.image !== '' ? (
            <div className="bg-[#535353] rounded-full p-[6px]">
              <UserIcon className="w-5 h-5" />
            </div>
          ) : (
            <img src={session?.user.image} className="rounded-full w-10 h-10" />
          )}
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5 mr-2" />
        </div>
      </header>

      <section
        className={`flex flex-col items-center sm:flex-row sm:items-end sm:space-x-7 space-y-4 bg-gradient-to-b to-black ${color} h-auto sm:h-80 text-white p-8`}
      >
        <img src={playlist?.images[0]?.url} className="w-48 sm:w-40 md:w-48 lg:w-56 shadow-2xl" />
        <div>
          <p className="text-xs font-bold uppercase">Playlist</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-.04rem]">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
