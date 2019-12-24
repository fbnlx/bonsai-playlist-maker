import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DraggablePlaylist from './DraggablePlaylist';
import { arrayMove } from 'react-sortable-hoc';
import Axios from 'axios';
import useStyles from '../styles/PlaylistStyles';

Axios.defaults.headers.common['access-token'] = 'rFxfO0Tid28E4JwU';

export default function Playlist(props) {
    const classes = useStyles();
    const id = props.id;
    const [playlistSongs, setPlaylistSongs] = React.useState([]);
    const [deleteList, setDeleteList] = React.useState([]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setPlaylistSongs(arrayMove(playlistSongs, oldIndex, newIndex));
    };

    React.useEffect(() => {
        async function fetchSongDetails() {
            const promises = props.songs.map(async song => {
                const response = await Axios.get(`https://bonsai-playlist.herokuapp.com/songs/${song.songId}`)
                return response.data;
            });
            Promise.all(promises).then(p => {
                let newPlaylistSongs = p.map(npls => {
                    let position = props.songs.find(
                        song => song.songId === npls.song.id)['position'];
                    return { ...npls.song, 'position': position };
                });
                newPlaylistSongs.sort((a, b) => a.position - b.position);
                setPlaylistSongs(newPlaylistSongs)
            });
        };
        fetchSongDetails();
    }, []);

    const markForDelete = (songId) => {
        setDeleteList([...deleteList, songId]);
        let newPlaylistSongs = playlistSongs.filter(song => song.id !== songId);
        setPlaylistSongs(newPlaylistSongs);
    }

    async function handleClick() {
        const promises = deleteList.map(async idToDelete => {
            const response =
                await Axios.delete(
                    `https://bonsai-playlist.herokuapp.com/playlists/${id}/songs/${idToDelete}`
                );
            return response.data;
        });
        Promise.all(promises).then(p => {
            const listOrderPromises = playlistSongs.map(async (song, idx) => {
                const listOrderResponse =
                    await Axios.patch(
                        `https://bonsai-playlist.herokuapp.com/playlists/${id}/songs/${song.id}`,
                        {
                            "position": idx
                        }
                    );
                return listOrderResponse.data;
            });
            Promise.all(listOrderPromises).then(q => {
                console.log(q);
            })
        })

    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.name}
                </Typography>
                <DraggablePlaylist
                    playlistId={props.id}
                    origin="userplaylists"
                    playlistSongs={playlistSongs}
                    onSortEnd={onSortEnd}
                    markForDelete={markForDelete}
                />
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    onClick={handleClick}
                    startIcon={<SaveIcon />}
                >
                    Save
                </Button>
            </CardActions>
        </Card>
    );
}