import React, {Component} from 'react';

// requires props
// title as text
// sub as text incuding any joiner
// sty as className text
export default class JumpFind extends Component {

  handle() {
    let value = this.refs.link.value;
      Session.set('now', value);
      let findBox = document.getElementById('find');
		  findBox.focus();
  }

  render() {

    let style = this.props.sty || 'action clear';
    let inStyle = this.props.inStyle ? { backgroundColor: 'rgba(255,255,255,0.1)' } : {};

    return (
      <button
        className={style}
        onClick={this.handle.bind(this)}
        ref='link'
        value={this.props.title}
        style={inStyle}
        >{this.props.title}{this.props.sub}
      </button>
    );
  }
}