import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CreateIcon from '@material-ui/icons/Create';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import Playlist from './Playlist';
import useStyles from '../styles/ViewPlaylistPageStyles';

const cookies = new Cookies();

Axios.defaults.headers.common['access-token'] = "" + process.env.REACT_APP_ACCESS_TOKEN

export default function ViewPlaylistPage(props) {
    const classes = useStyles();
    const [spacing, setSpacing] = React.useState(10);
    const [userPlaylists, setUserPlaylists] = React.useState([]);
    const [dataFetched, setDataFetched] = React.useState(false);

    React.useEffect(() => {
        async function fetchPlaylists() {
            const playlistResponse = await Axios.get("https://bonsai-playlist.herokuapp.com/playlists");
            let idList = (cookies.get('myPlaylists') ? cookies.get('myPlaylists').split(",") : []);
            let retrievedPlaylists = playlistResponse.data.playlists
            let ownedPlaylists = retrievedPlaylists.filter(p => idList.indexOf(p.id) !== -1);
            setUserPlaylists(ownedPlaylists);
            setDataFetched(true);
        }
        fetchPlaylists();
    }, []);

    return (
        <div>
            <h1>My Playlists</h1>
            {userPlaylists.length > 0 ?
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Grid container justify="center" spacing={spacing}>
                            {userPlaylists.map(p =>
                                <Grid key={p.id} item>
                                    <Playlist
                                        key={p.id}
                                        id={p.id}
                                        name={p.name}
                                        songs={p.songs}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                : dataFetched ?
                    <div>
                        <h2>Seems like you have no playlists to show.</h2>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<CreateIcon />}
                            onClick={() => props.history.push("/newPlaylist")}
                        >
                            Create one
                        </Button>
                    </div>
                    :
                    <div></div>
            }
        </div>
    );
}