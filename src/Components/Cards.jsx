import React, { Component } from 'react';
import Card from "./Card";
import firebase from "firebase";
import '../firebase'
import "../resource/component.css"

var db = firebase.firestore();

class Cards extends Component {
  state = {
    cards: [],
    data: {}
  };
  getData = () => {
    db.collection("users").where("room_id", "==", this.props.room_id).onSnapshot(query => {
      this.setState({ cards: [] })
      let i = 0;
      query.forEach(doc => {
        if (doc.id !== this.props.id) {
          ++i;
          this.setState({ cards: [...this.state.cards, <Card key={doc.id} id={doc.id} data={this.props.cards} pid={this.props.id} no={i}></Card>] })
        }
      });
    });
  }
  constructor(props) {
    super(props);
    this.getData();
  }
  render() {
    return (
      <div id='parent'>
        {this.state.cards}
      </div>
    );
  }
}

export default Cards;
