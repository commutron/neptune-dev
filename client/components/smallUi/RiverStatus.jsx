import React from 'react';
import Pref from '/client/global/pref.js';
                    
const RiverStatus = ({ items, river, riverTitle, riverAlt, riverAltTitle })=> (
  <div className='mockTable min300 max400'>
    <div className='mockTableGroup cap'>
    {items === 0 ?
      <div className='mockTableRow'>
        <div className='mockTableCell'>
          <i className='fas fa-hourglass-start fa-lg'></i>
          <i> No {Pref.item}s created</i>
        </div>
      </div>
    : null}
    <div className='mockTableRow'>
      <div className='mockTableCell'>
        {!river ?
          <dl>
            <dt>
              <i className='fas fa-exclamation-circle fa-lg fa-fw'>
              </i>No {Pref.buildFlow}
            </dt>
          </dl>
        :
          <dl>
            <dt>
              <i className='fas fa-check-square fa-lg fa-fw greenT'>
              </i>{Pref.buildFlow}: 
            </dt>    
            <dd>{riverTitle}</dd>
          </dl>
        }
      </div>
    </div>
    <div className='mockTableRow'>
      <div className='mockTableCell'>
        {!riverAlt ? 
          <dl>
            <dt>
              <i className='fas fa-question-circle fa-lg fa-fw'>
              </i>No {Pref.buildFlowAlt}
            </dt>
          </dl>
        :
          <dl>
            <dt>
              <i className='fas fa-check-square fa-lg fa-fw greenT'>
              </i>{Pref.buildFlowAlt}:
            </dt>    
            <dd>{riverAltTitle}</dd>
          </dl>
        }
      </div>
    </div>
    </div>
  </div>
);

export default RiverStatus;