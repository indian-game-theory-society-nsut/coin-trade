import React, { Component } from 'react';
import './App.css';
import { Redirect, Route, BrowserRouter } from "react-router-dom";
import Main from './Components/Main'
import End from './Components/End'
import Count from './Components/Count'
import Register from './Components/Register'
import Rules from './Components/Rules'
import './resource/component.css'

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route path="/register" exact component={Register}></Route>
            <Route exact path="/" render={() => (<Redirect to="/register" />)} />
          </div>
        </BrowserRouter>
      </div>
    )
  }

  state = {
    register: true,
    count: false,
    start: false,
    end: false,
    coins: 0,
    cheat: 0,
    cooperate: 0
  }

  setCoins = (coin, cheat, cooperate) => {
    this.setState({ coins: coin, cheat: cheat, cooperate: cooperate });
  }

  componentDidMount() {
    const register = new Date("Mar 31, 2019, 17:30:00").getTime();
    const start = new Date("Mar 31, 2019, 17:57:01").getTime();
    const end = new Date("Mar 31, 2019, 18:15:00").getTime();
    this.countDown = setInterval(() => {
      let now = new Date().getTime();
      let distance1 = register - now;
      let distance2 = start - now;
      let distance3 = end - now;

      if (!this.state.count && distance1 < 0)
        this.setState({ count: true });

      if (!this.state.start && distance2 < 0)
        this.setState({ start: true });

      if (!this.state.end && distance3 < 0) {
        this.setState({ end: true });
        clearInterval(this.countDown);
      }
    }, 1000);
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          {this.state.end ? (
            <div>
              <Route path="/end" render={(props) => <End {...props} coins={this.state.coins} cheat={this.state.cheat} cooperate={this.state.cooperate} />}></Route>
              <Route exact path="/rules" render={() => (<Redirect to="/end" />)} />
              <Route exact path="/register" render={() => (<Redirect to="/end" />)} />
              <Route exact path="/main" render={() => (<Redirect to="/end" />)} />
              <Route exact path="/count" render={() => (<Redirect to="/end" />)} />
            </div>
          ) : (
              this.state.start ? (
                <div>
                  <Route path="/rules" exact component={Rules}></Route>
                  <Route path="/main" render={(props) => <Main {...props} setCoins={this.setCoins} />}></Route>
                  <Route exact path="/" render={() => (<Redirect to="/rules" />)} />
                  <Route exact path="/end" render={() => (<Redirect to="/rules" />)} />
                  <Route exact path="/register" render={() => (<Redirect to="/rules" />)} />
                  <Route exact path="/count" render={() => (<Redirect to="/rules" />)} />
                </div>
              ) : this.state.count ? (
                <div>
                  <Route path="/count" exact component={Count}></Route>
                  <Route exact path="/rules" render={() => (<Redirect to="/register" />)} />
                  <Route exact path="/" render={() => (<Redirect to="/count" />)} />
                  <Route exact path="/end" render={() => (<Redirect to="/count" />)} />
                  <Route exact path="/register" render={() => (<Redirect to="/count" />)} />
                  <Route exact path="/main" render={() => (<Redirect to="/count" />)} />
                </div>
              ) : (
                    <div>
                      <Route exact path="/rules" render={() => (<Redirect to="/register" />)} />
                      <Route path="/register" exact component={Register}></Route>
                      <Route exact path="/end" render={() => (<Redirect to="/register" />)} />
                      <Route exact path="/" render={() => (<Redirect to="/register" />)} />
                      <Route exact path="/main" render={() => (<Redirect to="/register" />)} />
                      <Route exact path="/count" render={() => (<Redirect to="/register" />)} />
                    </div>
                  )
            )
          }
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
