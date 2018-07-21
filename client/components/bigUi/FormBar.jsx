import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import NCAdd from '../river/NCAdd.jsx';
import FirstAdd from '../river/FirstAdd.jsx';
import ShortAdd from '../river/ShortAdd.jsx';

// batchData, itemData, app, action

export default class FormBar extends Component	{
  
  constructor() {
    super();
    this.state = {
      show: 'NC',
    };
  }
  
  handleDone() {
    this.setState({ show: 'NC' });
    this.ncSlct.checked = true;
  }
  
  render() {
    
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    //const v = this.props.versionData;
    const users = this.props.users;
    const app = this.props.app;
    
    const showX = b && this.props.action === 'xBatchBuild' && b.completed === false;
    const showlegacyItem = (b && i) && !(b.finishedAt !== false || i.finishedAt !== false );
    
    return(
      <div className='proActionForm'>
        {showX || showlegacyItem ?
          <div className='footLeft'>
            <label htmlFor='ncselect' className='formBarToggle'>
              <input
                type='radio'
                id='ncselect'
                name='formbarselect'
                className='radioIcon'
                ref={(i)=>this.ncSlct = i}
                onChange={()=>this.setState({ show: 'NC' })}
                defaultChecked />
              <i className='fas fa-stop-circle formBarIcon'></i>
              <span className='actionIconText'>{Pref.nonCon}</span>
            </label>
            <label htmlFor='firstselect' className='formBarToggle'>
              <input
                type='radio'
                id='firstselect'
                name='formbarselect'
                className='radioIcon'
                onChange={()=>this.setState({ show: 'F' })}
                disabled={!Roles.userIsInRole(Meteor.userId(), 'verify')} />
              <i className='fas fa-play-circle formBarIcon'></i>
              <span className='actionIconText'>First</span>
            </label>
            <label htmlFor='shortselect' className='formBarToggle'>
              <input
                type='radio'
                id='shortselect'
                name='formbarselect'
                className='radioIcon'
                onChange={()=>this.setState({ show: 'S' })} />
              <i className='fas fa-pause-circle formBarIcon'></i>
              <span className='actionIconText'>Shortfall</span>
            </label>
          </div>
        : null}
        <div className='footCent'>
          {b ?
            this.props.action === 'xBatchBuild' ?
              this.state.show === 'NC' ?
                //<NCAdd 
                  //id={b._id}
                  //barcode={i.serial}
                  //app={app} />
                <p className='centreText'>Batch NC form <em>in development</em></p>
              : this.state.show === 'F' ?
                //<FirstAdd
                  //id={b._id}
                  //barcode={i.serial}
                  //riverKey={b.river}
                  //riverAltKey={b.riverAlt}
                  //allFlows={w.flows}
                  //users={users}
                  //app={app}
                  //doneClose={()=>this.handleDone()} />
                <p className='centreText'>Batch Verify form <em>in development</em></p>
              : this.state.show === 'S' ?
                //<ShortAdd
                  //id={b._id}
                  //serial={i.serial}
                  //app={app}
                  //doneClose={()=>this.handleDone()} />
                  <p className='centreText'>Batch Omit form <em>in development</em></p>
              : null
            :
              b && i ?
                this.state.show === 'NC' ?
                  <NCAdd 
                    id={b._id}
                    barcode={i.serial}
                    app={app} />
                : this.state.show === 'F' ?
                  <FirstAdd
                    id={b._id}
                    barcode={i.serial}
                    riverKey={b.river}
                    riverAltKey={b.riverAlt}
                    allFlows={w.flows}
                    users={users}
                    app={app}
                    doneClose={()=>this.handleDone()} />
                : this.state.show === 'S' ?
                  <ShortAdd
                    id={b._id}
                    serial={i.serial}
                    app={app}
                    doneClose={()=>this.handleDone()} />
                : null
              : null
          : null}
        </div>
        <div className='footRight'>
        </div>
      </div>
    );
  }
}