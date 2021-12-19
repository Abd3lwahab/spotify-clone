import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlitsAtom'
import Song from './Song'

function Songs() {
  const playlist = useRecoilValue(playlistState)

  return (
    <div className="px-0 sm:px-8 flex flex-col pb-24">
      {playlist?.tracks.items.map(({ track }, idx) => (
        <Song track={track} key={idx} idx={idx + 1} />
      ))}
    </div>
  )
}

export default Songs
