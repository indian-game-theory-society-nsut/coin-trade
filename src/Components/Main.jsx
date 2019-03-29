import React, { Component } from 'react';
import firebase from "firebase";
import Nav from './Nav';
import Cards from './Cards';
import '../firebase'

var db = firebase.firestore();

class App extends Component {
  state = {
    isSignedIn: false,
    userVal: {},
    cards: {},
    coin: 0,
    room_id: -1,
    allowed: false
  };
  newLogin = (user) => {
    if (user) {
      this.setState({ isSignedIn: true, userVal: user });
      db.collection("users").doc(this.state.userVal.uid).onSnapshot(query => {
        let q = query.data();
        for (const key in q) {
          if (key !== "room_id" && key !== "name" && key !== "coins" && key !== "email" && key !== "no") {
            let temp = this.state.cards;
            temp[key] = q[key];
            this.setState({ cards: temp });
          }
        }
        this.setState({ room_id: q.room_id, coin: q.coins });
        this.props.setCoins(this.state.coin);
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

  componentWillUnmount() {
    this.props.setCoins(this.state.coin);
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
      </div>
    );
  }
}

export default App;
