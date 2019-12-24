import React from 'react';
import Grid from '@material-ui/core/Grid';
import SongList from './SongList';
import { arrayMove } from 'react-sortable-hoc';
import Button from '@material-ui/core/Button';
import DraggablePlaylist from './DraggablePlaylist';
import SaveIcon from '@material-ui/icons/Save';
import Cookies from 'universal-cookie';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Axios from 'axios';
import useStyles from '../styles/NewPlaylistPageStyles';

Axios.defaults.headers.common['access-token'] = 'rFxfO0Tid28E4JwU';

const cookies = new Cookies();



export default function NewPlaylistPage(props) {
    const classes = useStyles();
    const [spacing, setSpacing] = React.useState(6);
    const [playlistName, setPlaylistName] = React.useState('');
    const [playlistSongs, setPlaylistSongs] = React.useState([]);

    React.useEffect(() => {
        ValidatorForm.addValidationRule("isNameLengthCorrect", value =>
            playlistName.length > 2 && playlistName.length < 17);
        ValidatorForm.addValidationRule("noSpecialCharacters", value =>
            (/^[a-zA-Z0-9\söüóőúéáűí]*$/.test(playlistName)));
    });

    const addToPlaylist = (song) => {
        console.log("song: " + song);
        let newPlaylist = [...playlistSongs, song];
        setPlaylistSongs(newPlaylist);
        console.log("playlist: " + playlistSongs);
    };

    const handleChange = event => {
        setPlaylistName(event.target.value);
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setPlaylistSongs(arrayMove(playlistSongs, oldIndex, newIndex));
    };

    const clearList = () => {
        props.history.push("/newPlaylist");
    }

    async function handlesubmit(event) {
        let newPlaylistObject = {
            "name": playlistName, songs: playlistSongs.map((s, idx) => {
                return ({ "songId": s.id, "position": idx + 1 })
            })
        };
        const response = await Axios.post(
            'https://bonsai-playlist.herokuapp.com/playlists/',
            newPlaylistObject
        );
        console.log(response);
        let cookieToStore = response.data.id;
        let oldCookie = (cookies.get('myPlaylists') ? cookies.get('myPlaylists') : "");
        cookies.set('myPlaylists', `${oldCookie},${cookieToStore}`, { path: '/' });
        props.history.push("viewPlaylists");
        // event.preventDefault();
    }

    return (
        <div>
            <h1>Create a new playlist</h1>
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={spacing}>
                        <Grid item>
                            <SongList origin='newplaylist' addToPlaylist={addToPlaylist} />
                        </Grid>
                        <Grid item>
                            <div>
                                <h2>Your Playlist</h2>
                                <ValidatorForm className={classes.root} autoComplete="off" onSubmit={handlesubmit}>
                                    <div>
                                        <TextValidator
                                            id="standard-name"
                                            label="Name"
                                            value={playlistName}
                                            onChange={handleChange}
                                            validators={["required", "isNameLengthCorrect", "noSpecialCharacters"]}
                                            errorMessages={
                                                [
                                                    "Please enter a playlist name",
                                                    "Must be 3 - 16 characters long",
                                                    "Only regular characters and space"
                                                ]}
                                        />
                                    </div>
                                    <div>
                                        <DraggablePlaylist
                                            origin="newplaylist"
                                            playlistSongs={playlistSongs}
                                            onSortEnd={onSortEnd}
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => (window.location.reload())}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            className={classes.button}
                                            startIcon={<SaveIcon />}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </ValidatorForm>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}