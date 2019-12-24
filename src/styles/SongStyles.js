import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    addIcon: {
        opacity: 0.5,
        color: '#4caf50',
        cursor: 'pointer',
        "&:hover": {
            opacity: 1,
            transform: 'scale(1.2)',
            transition: '0.5s'
        }
    }
}));