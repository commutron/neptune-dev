import React, {Component} from 'react';

import DataToggle from '../../components/tinyUi/DataToggle.jsx';
import IkyToggle from '../../components/tinyUi/IkyToggle.jsx';
import NCAdd from '../../components/river/NCAdd.jsx';

export default class Dashboard extends Component	{
  
  render() {
    
    let scrollFix = {
      overflowY: 'auto'
    };
    let overScrollSpacer = {
      width: '100%',
      height: '60px'
    };
    
    return (
      <div className='dashMainSplit'>
        <div className='dashMainLeft' style={scrollFix}>
          {this.props.children[0]}
          <div style={overScrollSpacer}></div>
        </div>
        
        <div className='gridMainRight' style={scrollFix}>
          {this.props.children[1]}
          <div style={overScrollSpacer}></div>
        </div>
        
        <div className='dashAction'>
        
            <div className='footLeft'>

            </div>
            <div className='footCent'>
              <ActionBar 
                id={this.props.id}
                serial={this.props.serial}
                nc={this.props.nc}
                app={this.props.app} />
              </div>
            <div className='footRight'>
              <DataToggle />
              <IkyToggle />
            </div>
      
        </div>
        {/*React.cloneElement(this.props.children[0], this.props)*/}
      </div>
    );
  }
}

export class ActionBar extends Component {
  
  
  render() {
    
    
    if(this.props.nc) {
    
    return(
      
        <NCAdd 
          id={this.props.id}
          barcode={this.props.serial}
          nons={this.props.app.nonConOption}
          ancs={this.props.app.ancillaryOption}/>
      );
    }
    
    
    return(
      
      <i></i>
    );
  }
}