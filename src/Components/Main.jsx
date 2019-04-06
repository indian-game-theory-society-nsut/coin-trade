import React, { Component } from 'react';
import firebase from "firebase";
import Nav from './Nav';
import Cards from './Cards';
import '../firebase'
import '../resource/component.css'

var db = firebase.firestore();

class App extends Component {
  state = {
    isSignedIn: false,
    userVal: {},
    cards: {},
    coin: 0,
    cheat: 0,
    cooperate: 0,
    room_id: -1,
    allowed: false,
    min: 0,
    sec: 0
  };
  newLogin = (user) => {
    if (user) {
      this.setState({ isSignedIn: true, userVal: user });
      db.collection("users").doc(this.state.userVal.uid).onSnapshot(query => {
        let q = query.data();
        for (const key in q) {
          if (key !== "room_id" && key !== "name" && key !== "coins" && key !== "email" && key !== "no" && key !== "cooperate" && key !== "coins") {
            let temp = this.state.cards;
            temp[key] = q[key];
            this.setState({ cards: temp });
          }
        }
        this.setState({ room_id: q.room_id, coin: q.coins, cheat: q.cheat, cooperate: q.cooperate });
        if (this.state.room_id >= 0)
          this.setState({ allowed: true });
      })
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  }

  constructor(props) {
    super(props);
    firebase.auth().onAuthStateChanged(this.newLogin);
  }

  componentDidMount() {
    const countDownDate = new Date("Apr 7, 2019, 18:15:00").getTime();
    this.countDown = setInterval(() => {
      let now = new Date().getTime();
      let distance = countDownDate - now;

      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(this.countDown);
      }

      this.setState({ min: minutes, sec: seconds });

    }, 1000);
  }

  componentWillUnmount() {
    this.props.setCoins(this.state.coin, this.state.cheat, this.state.cooperate);
  }

  render() {
    return (
      <div className="App">
        <Nav userName={this.state.userVal.displayName} pic={this.state.userVal.photoURL} coin={this.state.coin} />
        {
          this.state.allowed ? (
            <Cards id={this.state.userVal.uid} room_id={this.state.room_id} cards={this.state.cards} />) : (
              <div style={{ marginTop: "10%", fontSize: "2em" }}>
                Wait
              </div>
            )
        }
        <div style={{ margin: "10%" }}>
        </div>
        <div>Event ends in</div>
        <div style={{ color: "#f50057" }}>
          {this.state.min} min: {this.state.sec} sec
      </div>
      </div>
    );
  }
}

export default App;
