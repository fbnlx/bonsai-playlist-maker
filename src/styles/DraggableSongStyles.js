import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    deleteIcon: {
        opacity: 0.5,
        color: '#D32F2F',
        marginLeft: '1rem',
        cursor: 'pointer',
        "&:hover": {
            opacity: 1,
            transform: 'scale(1.2)',
            transition: '0.5s'
        }
    }
}));