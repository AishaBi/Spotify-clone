import { atom } from "recoil";

export const playlistState = atom({
    key:"playlistState",
    default:null,
});

export const playlistIdState = atom({
    //each atom needs unique key
    key:"playlistIdState",
    //click playlist and inspect, console should give playlist id
    default:"37i9dQZF1DX8vmVOT0h7vf",
});