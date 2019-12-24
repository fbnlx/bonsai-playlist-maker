import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import { SortableElement } from 'react-sortable-hoc';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import useStyles from '../styles/DraggableSongStyles';

const DraggableSong = SortableElement((props) => {
    const classes = useStyles();

    const handleClick = () => {
        props.markForDelete(props.id);
    }

    return (
        <ListItem button>
            <ListItemAvatar>
                <Avatar>
                    <LibraryMusicIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.title} secondary={props.performer} />
            {props.origin === 'userplaylists' &&
                <DeleteForeverIcon
                    className={classes.deleteIcon}
                    onClick={handleClick}
                />}
        </ListItem>
    );
})

export default DraggableSong;



