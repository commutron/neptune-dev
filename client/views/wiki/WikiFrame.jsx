import React, {Component} from 'react';

export default class WikiFrame extends Component {

  render () {
    
    let sty = {
      width: '100%',
      border: '0',
      margin: '0',
      padding: '0',
    };
    
    let sizeAdjust = this.props.indie ? 90 : 150;
    
    return (
      <iframe
        id='instruct'
        style={sty}
        src={this.props.go}
        height={( (document.body.scrollHeight - document.body.scrollTop) - sizeAdjust ) +'px'}
        allowFullScreen
        />
    );
  }
}