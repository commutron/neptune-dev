import React, {Component} from 'react';

// requires props
// title as text
// link as text
// sty as text

export default class JumpText extends Component {

  handle() {
    let value = this.link.value;
      Session.set('now', value);
  }

  render() {
    
    let clss = this.props.sty ? 'jump ' + this.props.sty : 'jump';

    return (
      <button
        className={clss}
        onClick={this.handle.bind(this)}
        ref={(i)=> this.link = i}
        value={this.props.link}
        >{this.props.title}
      </button>
    );
  }
}