import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

function PaperSheet(props) {
  const { classes } = props;

  return (
    <div>
      <Paper className={classes.root} elevation={1} style={{ marginTop: "10%", height: "100%", textAlign: "center" }}>
        <Typography variant="h5" component="h3">
          Rules
        </Typography>
        <Typography component="p" style={{ marginBottom: "10px" }}>
          Rules for the event are available <a href="https://drive.google.com/open?id=1sieaZBGtsu2t7awNLo5PsuNP2litJyk9" target="_blank">here</a>
        </Typography>
        <Button variant="outlined" color="secondary" className={classes.button}>
          <Link to="/main" style={{ textDecoration: "none" }}>
            Gotcha
          </Link>
        </Button>
      </Paper>
    </div>
  );
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);
