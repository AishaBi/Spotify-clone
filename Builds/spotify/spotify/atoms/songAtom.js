import { atom } from "recoil";

export const currentTrackIdState = atom({
    //each atom must have a unique key
    key: "currentTrackIdState", default:null,
});

export const isPlayingState = atom({
    //each atom must have a unique key
    key: "isPlayingState", default: false,
});
