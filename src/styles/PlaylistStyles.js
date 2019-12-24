import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    card: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    list: {
        width: '100%',
        maxWidth: '560px',
        backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: 'auto'
    }
}));