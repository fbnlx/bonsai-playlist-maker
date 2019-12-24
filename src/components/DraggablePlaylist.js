import React from 'react';
import List from '@material-ui/core/List';
import { SortableContainer } from 'react-sortable-hoc';
import DraggableSong from './DraggableSong';
import Divider from '@material-ui/core/Divider';
import useStyles from '../styles/DraggablePlaylistStyles';


const DraggablePlaylist = SortableContainer((props) => {
    const classes = useStyles();

    return (
        <List className={classes.list}>
            {props.playlistSongs.map((song, i) =>
                [
                    <DraggableSong
                        key={`draggable-song-${song.id}`}
                        id={song.id}
                        playlistId={props.playlistId}
                        index={i}
                        title={song.title}
                        performer={song.performer}
                        origin={props.origin}
                        markForDelete={props.markForDelete}
                    />,
                    <Divider key={`draggable-divider-${song.id}`} />
                ]
            )}
        </List>
    );
})

export default DraggablePlaylist;



