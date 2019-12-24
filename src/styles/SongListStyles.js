import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        maxWidth: '660px',
        minWidth: '260px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: theme.palette.background.paper,
    },
    fullStar: {
        color: 'orange'
    }
}));