import React, {Component} from 'react';

import IkyToggle from '../../components/tinyUi/IkyToggle.jsx';

export default class Dashboard extends Component	{
  
  render() {
    
    return (
      <div>
        <div className='leftSide'>
          {this.props.children[0]}
        </div>
        
        <div className='rightSide'>
          {this.props.children[1]}
        </div>
        <div className='cornerFloat'><IkyToggle /></div>
        <footer className='actionBar'></footer>
      </div>
    );
  }
}