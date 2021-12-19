import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  LockClosedIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import { playlistIdState } from '../atoms/playlitsAtom'
import useSpotify from '../hooks/useSpotify'

const Sidebar = () => {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()

  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((res) => {
        setPlaylists(res.body.items)

        // Setting value of playlistIdState to the first playlist in the list
        if (!playlistId) {
          setPlaylistId(res.body.items[0].id)
        }
      })
    }
  }, [session, spotifyApi])

  return (
    <div
      className="text-gray-500 p-5 text-xs border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide sm:text-sm sm:max-w-[12rem] lg:max-w-[15rem] 
      sm:min-w-[12rem] lg:min-w-[15rem] hidden md:inline-flex"
    >
      <div className="space-y-4 min-w-0">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <button onClick={() => signOut()} className="flex items-center space-x-2 hover:text-white">
          <LockClosedIcon className="h-5 w-5" />
          <p>Sign Out</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className={`cursor-pointer hover:text-white truncate ${
              playlist.id === playlistId ? 'text-white' : 'hover:text-white'
            }`}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
