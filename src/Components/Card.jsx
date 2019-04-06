import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase';
import '../resource/component.css';
import '../firebase';

var db = firebase.firestore();

class SimpleCard extends React.Component {
  state = {
    engage: false,
    request: false,
    confirm: false,
    allowed: true,
    process: false
  };

  init = () => {
    const token = db.collection("tokens");
    token.where("sender.user_id", "==", this.props.pid).where("replier.user_id", "==", this.props.id).onSnapshot(query => {
      if (query.empty)
        this.setState({ confirm: false, process: false });
      else
        this.setState({ confirm: true });
    })
    token.where("replier.user_id", "==", this.props.pid).where("sender.user_id", "==", this.props.id).onSnapshot(query => {
      if (query.empty)
        this.setState({ request: false });
      else
        this.setState({ request: true });
    })
  }

  constructor(props) {
    super(props);
    this.init();
  }

  flipState = (val) => {
    if (this.props.data[this.props.id] !== undefined) {
      let cnt = 0;
      for (let i = 0; i < 4; i++) {
        cnt += this.props.data[this.props.id].data[i];
      }
      if (cnt >= 5) {
        this.setState({ allowed: false });
      }
    }
    this.setState({ engage: this.state.engage ^ 1 });
    // if (this.state.request === false && this.state.engage)
    //   this.setState({ confirm: true });
    // else if (this.state.engage===false)
    //   this.setState({ request: false });
    if (val >= 0)
      this.process(val);
  }

  process = (value) => {
    const token = db.collection("tokens");
    if (this.state.request) {
      this.setState({ process: true });
      token.where("sender.user_id", "==", this.props.id).where("replier.user_id", "==", this.props.pid).get().then(query => {
        query.forEach(docRef => {
          const id = docRef.id;
          const doc = db.collection("tokens").doc(id);
          return db.runTransaction(transaction => {
            return transaction.get(doc).then(document => {
              return transaction.update(doc, { replier: { user_id: this.props.pid, val: value } });
            })
          })
        })
      })
    }
    else {
      let uid = this.props.pid + this.props.id;
      if (this.props.id > this.props.pid)
        uid = this.props.id + this.props.pid;
      token.doc(uid).set({
        sender: {
          user_id: this.props.pid,
          val: value
        },
        replier: {
          user_id: this.props.id,
          val: -1
        }
      });
    }
  }

  render() {
    return (
      <Card className="card">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" align="left">
            Opponent {this.props.no}
          </Typography>
          <Typography component="p" align="left">
            Pass: {this.props.data[this.props.id] === undefined ? 0 : this.props.data[this.props.id].data[0]}
          </Typography>
          <Typography component="p" align="left">
            +1: {this.props.data[this.props.id] === undefined ? 0 : this.props.data[this.props.id].data[1]}
          </Typography>
          <Typography component="p" align="left">
            +2: {this.props.data[this.props.id] === undefined ? 0 : this.props.data[this.props.id].data[2]}
          </Typography>
          <Typography component="p" align="left">
            +3: {this.props.data[this.props.id] === undefined ? 0 : this.props.data[this.props.id].data[3]}
          </Typography>
          {this.state.request ?
            (
              <div>
                <Typography component="p"></Typography>
                <Typography component="p" align="left" color="primary" variant="body2">
                  Opponent has attacked you
                </Typography>
              </div>) :
            false
          }
        </CardContent>
        {this.state.process ? (
          <CardContent>
            <Typography component="footer" align="left" color="primary">
              Processing
        </Typography>
          </CardContent>
        ) : (this.state.confirm ? (
          (
            <CardContent>
              <Typography component="footer" align="left" color="primary">
                Opponent attacked
              </Typography>
              <Typography component="footer" align="left" color="primary">
                Waiting for response
              </Typography>
            </CardContent>
          )
        ) : (this.state.allowed ? (
          <CardActions>
            {this.state.engage ? (
              <div>
                <Button size="small" color="secondary" onClick={this.flipState.bind(this, 0)}>
                  Pass
                  </Button>
                <Button size="small" color="secondary" onClick={this.flipState.bind(this, 1)}>
                  +1
                  </Button>
                <Button size="small" color="secondary" onClick={this.flipState.bind(this, 2)}>
                  +2
                  </Button>
                <Button size="small" color="secondary" onClick={this.flipState.bind(this, 3)}>
                  +3
                  </Button>
              </div>) : (
                <Button size="small" color="secondary" onClick={this.flipState.bind(this, -1)}>
                  Engage War
                  </Button>)}
          </CardActions>) : (
            <CardContent>
              <Typography component="footer" align="left" color="primary">
                Cant battle more than 5 times
            </Typography>
            </CardContent>
          )
          ))}
      </Card>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SimpleCard;
