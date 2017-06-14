import React, {Component} from 'react';

export default class WikiFrame extends Component {

  render () {
    
    let sty = {
      width: '100%',
      border: '0',
      margin: '0',
      paddinng: '0'
    };
    
    return (
      <iframe
        id='instruct'
        style={sty}
        src={this.props.go}
        height={( (document.body.scrollHeight - document.body.scrollTop) - 135 ) +'px'}
        allowFullScreen
        />
    );
  }
}