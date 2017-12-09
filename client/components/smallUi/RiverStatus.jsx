import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

export default class NoteLine extends Component	{
  
  render() {
    
    const dt = this.props;
    
    return (
      <div className='mockTable min300 max400'>
        <div className='mockTableGroup cap'>
        {dt.items === 0 ?
          <div className='mockTableRow'>
            <div className='mockTableCell'>
              <i className='fas fa-hourglass-start fa-lg' aria-hidden='true'></i>
              <i> No {Pref.item}s created</i>
            </div>
          </div>
        : null}
        <div className='mockTableRow'>
          <div className='mockTableCell'>
            {!dt.river ?
              <span>
                <i className='fas fa-exclamation-circle fa-lg' aria-hidden='true'></i>
                <i> No {Pref.buildFlow}</i>
              </span>
            :
              <span>
                <i className='fas fa-check-square fa-lg greenT' aria-hidden='true'></i>
                <i> {Pref.buildFlow}: <b>{dt.riverTitle}</b></i>
              </span>
            }
          </div>
        </div>
        <div className='mockTableRow'>
          <div className='mockTableCell'>
            {!dt.riverAlt ? 
              <span>
                <i className="fas fa-question-circle fa-lg" aria-hidden='true'></i>
                <i> No {Pref.buildFlowAlt}</i>
              </span>
            :
              <span>
                <i className='fas fa-check-square fa-lg greenT' aria-hidden='true'></i>
                <i> {Pref.buildFlowAlt}: <b>{dt.riverAltTitle}</b></i>
              </span>
            }
          </div>
        </div>
        </div>
      </div>
    );
  }
}