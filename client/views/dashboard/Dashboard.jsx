import React, {Component} from 'react';

import DashActionBar from '../../components/bigUi/DashActionBar.jsx';
import FormBar from '../../components/bigUi/FormBar.jsx';

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
        
        {this.props.action === 'build' ?
          <FormBar
            batchData={this.props.batchData}
            itemData={this.props.itemData}
            widgetData={this.props.widgetData}
            versionData={this.props.versionData}
            users={this.props.users}
            app={this.props.app} />
          :
          <DashActionBar
            snap={this.props.snap}
            batchData={this.props.batchData}
            itemData={this.props.itemData}
            widgetData={this.props.widgetData}
            versionData={this.props.versionData}
            groupData={this.props.groupData}
            app={this.props.app}
            action={this.props.action} />
        }
              
        {/*React.cloneElement(this.props.children[0], this.props)*/}
      </div>
    );
  }
}