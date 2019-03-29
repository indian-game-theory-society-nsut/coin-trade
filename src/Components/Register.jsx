import firebase from "firebase";
import Button from '@material-ui/core/Button';
import '../firebase'
import React from 'react';
import '../resource/component.css'

class Register extends React.Component {
  state = {
    days: 0,
    hrs: 0,
    min: 0,
    sec: 0,
    register: false,
    wait: true
  }

  newLogin = (user) => {
    this.setState({ wait: false });
    if (user) {
      this.setState({ register: true });
    }
  }

  register = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    this.setState({ wait: true });
    this.setState({ register: true });
  }

  constructor(props) {
    super(props);
    firebase.auth().onAuthStateChanged(this.newLogin);
  }

  componentDidMount() {
    const countDownDate = new Date("Mar 31, 2019, 17:55:01").getTime();
    this.countDown = setInterval(() => {
      let now = new Date().getTime();
      let distance = countDownDate - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.setState({ days: days, hrs: hours, min: minutes, sec: seconds });

      if (distance < 0) {
        this.setState({ sec: -1 });
        clearInterval(this.countDown);
      }

    }, 1000);
  }

  render() {
    return (
      <div className="container">
        Before registration ends
        <div className="countdown">
          {this.state.days} : {this.state.hrs} : {this.state.min} : {this.state.sec}
        </div>
        <div>

        </div>
        {this.state.wait ? (
          <div className="register">
            Wait
          </div>) : (
            this.state.register ? (
              <div className="register">
                Registered
          </div>) : (
                <div>
                  <Button variant="outlined" color="secondary" onClick={this.register} className="register-butt">
                    Register
        </Button>
                </div>)
          )}
      </div>
    );
  }
}

export default Register;