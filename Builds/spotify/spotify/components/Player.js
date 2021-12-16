import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState} from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import{ 
    HeartIcon,
    VolumeUpIcon as VolumeDownIcon,
 } from "@heroicons/react/outline";
import{ 
    RewindIcon,
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    VolumeUpIcon,
} from "@heroicons/react/solid";


function Player() {

    const spotifyApi = useSpotify();
    const {data: session, status } = useSession();
    const [currentTrackId, setCurrentIdTrack] =
        useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    //info about currently selected song
    const songInfo = useSongInfo();
    //fetch song info
    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
            setCurrentIdTrack(data.body?.item?.id);

            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                setIsPlaying(data.body?.is_playing);
            });
            });
        }
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId)
        {
            //fetch song info
            fetchCurrentSong();
            setVolume(50);

        }

    },[currentTrackIdState, spotifyApi, session])

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white
        grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/*Left side of player */}
            <div className="flex items-center space-x-4 ">
                <img 
                    className="hidden md:inline h-10 w-10"
                    src={songInfo?.album.images?.[0]?.url} 
                    alt="" 
            />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/*Center side of player */}

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button"/>

            {isPlaying ? (
                <PauseIcon className="button w-10 h-10" />
            ):  (
                <PlayIcon  className="button w-10 h-10" />
            )}
            
            <FastForwardIcon className="button "/>
            <ReplyIcon className="button" />


            </div>

            {/*Right side of player */}

        </div>
    );
}

export default Player;
