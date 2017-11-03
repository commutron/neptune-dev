import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

export default class NoteLine extends Component	{
  
  render() {
    
    const dt = this.props;
    
    return (
      <div className='mockTable max400'>
        <div className='mockTableGroup'>
        {dt.items === 0 ?
          <div className='mockTableRow'>
            <div className='mockTableCell'>
              <i className='fa fa-hourglass-start fa-2x' aria-hidden='true'></i>
              <i>No {Pref.item}s created</i>
            </div>
          </div>
        : null}
        {!dt.river ? 
          <div className='mockTableRow'>
            <div className='mockTableCell'>
              <i className='fa fa-exclamation-circle fa-2x' aria-hidden='true'></i>
              <i>No {Pref.buildFlow} selected</i>
            </div>
          </div>
        :
          <div className='mockTableRow'>
            <div className='mockTableCell'>
              <i>Current {Pref.buildFlow}: <b>{dt.riverTitle}</b></i>
            </div>
          </div>
        }
        {!dt.riverAlt ? 
          <div className='mockTableRow'>
            <div className='mockTableCell'>
              <i className="fa fa-question-circle fa-2x" aria-hidden='true'></i>
              <i>No {Pref.buildFlowAlt} selected</i>
            </div>
          </div>
        :
          <div className='mockTableRow'>
            <div className='mockTableCell'>
              <i>Current {Pref.buildFlowAlt}: <b>{dt.riverAltTitle}</b></i>
            </div>
          </div>
        }
        </div>
      </div>
    );
  }
}