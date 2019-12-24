import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
}));