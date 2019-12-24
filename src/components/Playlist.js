import React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import Axios from 'axios';
import uuid from 'react-uuid'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import DraggablePlaylist from './DraggablePlaylist';
import useStyles from '../styles/PlaylistStyles';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

Axios.defaults.headers.common['access-token'] = "" + process.env.REACT_APP_ACCESS_TOKEN

export default function Playlist(props) {
    const classes = useStyles();
    const id = props.id;
    const [playlistSongs, setPlaylistSongs] = React.useState([]);
    const [deleteList, setDeleteList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [updateStatus, setUpdateStatus] = React.useState("");

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

    const handleClick = async () => {
        const promises = deleteList.map(async idToDelete => {
            const response =
                await Axios.delete(
                    `https://bonsai-playlist.herokuapp.com/playlists/${id}/songs/${idToDelete}`
                );
            return response.data;
        });
        Promise.all(promises).then(p => {
            console.log(p);
            reorderList();
        })

    }

    const reorderList = async () => {
        try {
            for (const song of playlistSongs) {
                const response = await Axios.patch(
                    `https://bonsai-playlist.herokuapp.com/playlists/${id}/songs/${song.id}`,
                    {
                        "position": uuid()
                    }
                );
            }
            for (let i = 0; i < playlistSongs.length; i++) {
                const response2 = await Axios.patch(
                    `https://bonsai-playlist.herokuapp.com/playlists/${id}/songs/${playlistSongs[i].id}`,
                    {
                        "position": i
                    }
                );
            }
            setUpdateStatus("Playlist updated successfully");
            setOpen(true);
        } catch(err) {
            console.log(err);
            setUpdateStatus("Failed to update playlist");
            setOpen(true);
        }
        
    }

    const closeSnackbar = () => {
        setOpen(false);
    }

    return (
        <div>
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
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={open}
                autoHideDuration={3000}
                message={<span id="message-id">{updateStatus}</span>}
                ContentProps={{
                    "aria-describedby": "message-id"
                }}
                onClose={closeSnackbar}
                action={[
                    <IconButton
                        onClick={closeSnackbar}
                        color={"inherit"}
                        key="close"
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        </div>
    );
}