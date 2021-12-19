import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import spotifyApi from '../lib/spotify'
import { millisToMinutesAndSeconds } from '../lib/time'

function Song({ track, idx }) {
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrackId(track.id)
    setIsPlaying(true)
    spotifyApi.play({
      uris: [track.uri],
    })
  }

  return (
    <div
      className={`grid grid-cols-[16px,75%,1fr] md:grid-cols-[16px,44%,4fr,60px] items-center py-[6px] px-5 sm:px-4 cursor-pointer rounded-[4px] gap-x-2 sm:gap-x-5 ${
        currentTrackId === track.id
          ? 'bg-[rgba(255,255,255,.15)] text-white'
          : 'hover:bg-[rgba(255,255,255,.1)] text-[#a3a3a3] '
      }`}
      onClick={playSong}
    >
      <p className={`text-right ${currentTrackId === track.id ? 'text-[#1db954]' : ''}`}>{idx}</p>
      <div className="flex items-center">
        <img src={track.album.images[2].url} className="w-10  mr-2 sm:mr-5" />
        <div className="flex flex-col min-w-0">
          <p
            className={`${currentTrackId === track.id ? 'text-[#1db954]' : 'text-white'} truncate`}
          >
            {track.name}
          </p>
          <p className="truncate">{track.artists.map((artist) => artist.name).join(', ')}</p>
        </div>
      </div>
      <p className="min-w-0 truncate hidden md:inline">{track.album.name}</p>
      <p className="text-right">{millisToMinutesAndSeconds(track.duration_ms)}</p>
    </div>
  )
}

export default Song
