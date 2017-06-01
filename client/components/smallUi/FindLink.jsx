import React, {Component} from 'react';

// requires props
// title as text
// sub as text incuding any joiner
// sty as className text
export default class FindLink extends Component {

  handle() {
    let value = this.refs.text.value;
      Session.set('now', value);
  }

  render() {

    let style = this.props.sty || 'jump';

    return (
      <button
        className={style}
        onClick={this.handle.bind(this)}
        ref='text'
        value={this.props.title}
        >{this.props.title}{this.props.sub}
      </button>
    );
  }
}