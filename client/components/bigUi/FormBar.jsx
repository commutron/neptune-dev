import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import TideLock from '/client/components/tide/TideLock.jsx';

import NCAdd from '../river/NCAdd.jsx';
import NCFlood from '../river/NCFlood.jsx';
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
    //const w = this.props.widgetData;
    //const v = this.props.versionData;
    //const users = this.props.users;
    const app = this.props.app;
    
    const showX = b && this.props.action === 'xBatchBuild' && b.completed === false;
    const showlegacyItem = (b && i) && !(b.finishedAt !== false || i.finishedAt !== false );
    
    const pastPN = b.shortfall ? [...new Set( Array.from(b.shortfall, x => x.partNum ) )] : [];
    const pastRF = b.shortfall ? [...new Set( Array.from(b.shortfall, x => x.refs.toString() ) )] : [];
    
    return(
      <TideLock currentLive={this.props.currentLive} message={true}>
      <div className='proActionForm'>
        {showX || showlegacyItem ?
          <div className='footLeft'>
          {this.props.action === 'xBatchBuild' ? null :
            <label htmlFor='firstselect' className='formBarToggle'>
              <input
                type='checkbox'
                id='firstselect'
                name='toggleFirst'
                className='radioIcon'
                checked={this.props.showVerify}
                onChange={()=>this.props.changeVerify(true)}
                disabled={!Roles.userIsInRole(Meteor.userId(), 'verify')} />
              <i className='fas fa-thumbs-up formBarIcon'></i>
              <span className='actionIconText'>First</span>
            </label> }
            <label htmlFor='ncselect' className='formBarToggle'>
              <input
                type='radio'
                id='ncselect'
                name='formbarselect'
                className='radioIcon'
                ref={(i)=>this.ncSlct = i}
                checked={this.state.show === 'NC'}
                onChange={()=>this.setState({ show: 'NC' })} />
              <i className='fas fa-bug formBarIcon'></i>
              <span className='actionIconText'>{Pref.nonCon}</span>
            </label>
            <label htmlFor='shortselect' className='formBarToggle'>
              <input
                type='radio'
                id='shortselect'
                name='formbarselect'
                className='radioIcon'
                checked={this.state.show === 'S'}
                onChange={()=>this.setState({ show: 'S' })} />
              <i className='fas fa-exclamation-circle formBarIcon' data-fa-transform="down-1"></i>
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
                : this.state.show === 'S' ?
                  <ShortAdd
                    id={b._id}
                    serial={i.serial}
                    pastPN={pastPN}
                    pastRF={pastRF}
                    app={app}
                    doneClose={()=>this.handleDone()} />
                : null
              : 
                <NCFlood
                  id={b._id}
                  live={b.finishedAt === false}
                  app={app} />
          : null}
        </div>
        <div className='footRight'></div>
      </div>
      </TideLock>
    );
  }
}