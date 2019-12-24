import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Axios from 'axios';
import Song from './Song';
import useStyles from '../styles/SongListStyles';

Axios.defaults.headers.common['access-token'] = "" + process.env.REACT_APP_ACCESS_TOKEN

export default function SongList(props) {
    const classes = useStyles();
    const [listOfSongs, setListOfSongs] = React.useState([])

    React.useEffect(() => {
        async function fetchSongList() {
            const response = await Axios.get("https://bonsai-playlist.herokuapp.com/songs");
            setListOfSongs(response.data.songs);
        }
        fetchSongList();
    }, []);

    const addSongToPlaylist = (id) => {
        let newListOfAvailableSongs = listOfSongs.filter(s => s.id !== id);
        let newPlaylistSong = listOfSongs.filter(s => s.id === id)[0];
        setListOfSongs(newListOfAvailableSongs);
        props.addToPlaylist(newPlaylistSong);
    };

    return (
        <div>
            {props.origin === 'main' && <h1>Browse and Rate our songs!</h1>}
            {props.origin === 'newplaylist' && <h2>Available songs</h2>}
            <List className={classes.root}>
                {listOfSongs.map(s =>
                    [
                        <Song
                            key={s.id}
                            id={s.id}
                            title={s.title}
                            performer={s.performer}
                            rating={s.rating}
                            origin={props.origin}
                            addSongToPlaylist={addSongToPlaylist}
                        />,
                        <Divider key={`divider-${s.id}`} />
                    ]
                )}
            </List>
        </div>
    );
}