import React, {Component} from 'react';

import FormBar from '../../components/bigUi/FormBar.jsx';

export default class ProductionWrap extends Component	{

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
        
        <FormBar
          batchData={this.props.batchData}
          itemData={this.props.itemData}
          versionData={this.props.versionData}
          app={this.props.app}
          action={this.props.action} />
              
        {/*React.cloneElement(this.props.children[0], this.props)*/}
      </div>
    );
  }
}