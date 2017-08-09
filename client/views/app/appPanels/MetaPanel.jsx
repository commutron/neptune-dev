import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

export default class MetaPanel extends Component {

  render() {
    
    let sty = {
      fontFamily: 'monospace'
    };

    return (
      <div className='centre centreTrue' style={sty}>
        <p>Neptune v.0.4.5 Beta</p>
        <p>Copyright (c) 2016-present Commutron Industries, https://www.commutron.ca</p>
        <p>Author 2016-present Matthew Andreas https://github.com/mattandwhatnot</p>
        <p>All Rights Reserved</p>
        <p>No License</p>
        <p>Source avaliable, limited to Github and the "Github Terms of Service"</p>
      </div>
    );
  }
}