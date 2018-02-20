import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import NCAdd from '../river/NCAdd.jsx';
import FirstAdd from '../river/FirstAdd.jsx';
import IkyToggle from '../tinyUi/IkyToggle.jsx';

// batchData, itemData, app, action

export default class FormBar extends Component	{
  
  constructor() {
    super();
    this.state = {
      showNC: true,
    };
  }
  
  handleDone() {
    this.setState({ showNC: true });
    this.ncSlct.checked = true;
  }
  
  render() {
    
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    //const v = this.props.versionData;
    const users = this.props.users;
    const app = this.props.app;
    
    return(
      <div className='dashAction'>
        {b && i ?
          b.finishedAt !== false || i.finishedAt !== false ?
          null :
          <div className='footLeft'>
            <label htmlFor='ncselect' className='formBarToggle'>
              <input
                type='radio'
                id='ncselect'
                name='formbarselect'
                className='radioIcon'
                ref={(i)=>this.ncSlct = i}
                onChange={()=>this.setState({ showNC: true })}
                defaultChecked />
              <i className='fas fa-bug formBarIcon'></i>
              <span className='actionIconText'>{Pref.nonCon}</span>
            </label>
            <label htmlFor='firstselect' className='formBarToggle'>
              <input
                type='radio'
                id='firstselect'
                name='formbarselect'
                className='radioIcon'
                onChange={()=>this.setState({ showNC: false })} />
              <i className='fas fa-flag-checkered formBarIcon'></i>
              <span className='actionIconText'>First</span>
            </label>
          </div>
        : null}
        <div className='footCent'>
          {b && i ?
            this.state.showNC ?
              <NCAdd 
                id={b._id}
                barcode={i.serial}
                app={app} />
            :
              <FirstAdd
                id={b._id}
                barcode={i.serial}
                riverKey={b.river}
                riverAltKey={b.riverAlt}
                allFlows={w.flows}
                users={users}
                app={app}
                doneClose={()=>this.handleDone()} />
          : null}
        </div>
        <div className='footRight'>
          <IkyToggle />
        </div>
      </div>
    );
  }
}