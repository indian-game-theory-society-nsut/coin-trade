import React, { Component } from 'react';
import '../resource/component.css'

class End extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.coins);
  }
  render() {
    return (
      <div className="register">
        <div>
          Total Score : {this.props.coins}
        </div>
        <div>
          Results will be announced soon
        </div>
      </div>
    );
  }
}

export default End;