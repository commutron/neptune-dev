import React, {Component} from 'react';

import IkyToggle from '../../components/tinyUi/IkyToggle.jsx';

export default class Dashboard extends Component	{
  
  render() {
    
    return (
      <div className='dashMainSplit'>
        <div className='gridMainLeft'>
          {this.props.children[0]}
        </div>
        
        <div className='gridMainRight'>
          {this.props.children[1]}
        </div>
        {/*<div className='cornerFloat'><IkyToggle /></div>*/}
        <div className='dashAction'>
          <div className='actionBar'>
            <div className='footLeft'>hi</div>
            <div className='footCent'>sup</div>
            <div className='footRight'><IkyToggle /></div>
          </div>
        </div>
        {/*React.cloneElement(this.props.children[0], this.props)*/}
      </div>
    );
  }
}