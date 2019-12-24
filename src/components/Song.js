import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Rating from '@material-ui/lab/Rating';
import Axios from 'axios';
import useStyles from '../styles/SongStyles';

Axios.defaults.headers.common['access-token'] = "" + process.env.REACT_APP_ACCESS_TOKEN

const labels = {
    1: 'Awful :(',
    2: 'Not too bad...',
    3: 'Average',
    4: 'Nice',
    5: 'Awesome! :)'
};

function IconContainer(props) {
    const { value, ...other } = props;
    return (
        <Tooltip title={labels[value] || ''}>
            <span {...other} />
        </Tooltip>
    );
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};



export default function Song(props) {
    const classes = useStyles();
    const [title, setTitle] = React.useState(props.title)
    const [performer, setPerformer] = React.useState(props.performer)
    const [rating, setRating] = React.useState(props.rating)

    async function handleChange(e) {
        const newRating = parseInt(e.target.value)
        setRating(newRating);
        const response = await Axios.patch(
            `https://bonsai-playlist.herokuapp.com/songs/${props.id}`,
            {
                'rating': newRating
            }
        );
    }

    const handleAdd = () => {
        props.addSongToPlaylist(props.id);
    }

    return (
        <ListItem className={classes.songItem}>
            <ListItemAvatar>
                <Avatar>
                    <EqualizerIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={title} secondary={performer} />
            {props.origin === 'main' &&
                <Rating
                    name={`simple-controlled-${props.id}`}
                    value={rating}
                    IconContainerComponent={IconContainer}
                    onChange={handleChange}
                />
            }
            {props.origin === 'newplaylist' &&
                <AddCircleIcon
                    className={classes.addIcon}
                    name={props.id}
                    onClick={handleAdd}
                />
            }
        </ListItem>
    );
}