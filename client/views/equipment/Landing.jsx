import React, { useMemo, Fragment } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';
import EqTimeReport from './EqTimeReport';

import CalWrap from './calendar/CalWrap';

const Landing = ({ equipData, maintainData, issues, app, brancheS })=> {
  
  // const week0 = useMemo( ()=> moment().startOf('week'), [app]);
  // const week6 = useMemo( ()=> moment().endOf('week'), [app]);
  
  // const thisWeek = useMemo( ()=> maintainData
  //         .filter( f => !f.status &&
  //           moment(f.close).isBetween( week0, week6 ) )
  //         .sort((x1, x2)=>
  //           x1.close < x2.close ? -1 : 
  //           x1.close > x2.close ? 1 : 0 
  //       ), [maintainData]);
  
  return(
    <div className='overscroll'>
      
      <div className='wide centreRow'>
        <span className='flexSpace' />
        <NumBox
          num={equipData.filter( e => e.online && !e.hibernate ).length}
          name='Online'
          color='greenT' 
        />
        <NumBox
          num={equipData.filter( e => !e.online && !e.hibernate ).length}
          name='Offline'
          color='midnightBlueT' 
        />
        <NumBox
          num={equipData.filter( e => e.hibernate ).length}
          name={Pref.eqhib}
          color='darkgrayT' 
        />
        <NumBox
          num={issues || 0}
          name={`WIP ${Pref.eqissue}`}
          color='orangeT' 
        />
        
        <EquipForm
          id={false}
          lgIcon={true}
          rootURL={app.instruct}
          brancheS={brancheS} 
        />
      </div>

      {/*<div>
        <h3>Upcoming Service Due</h3>
        <dl className='max400'>
        {thisWeek.map( (mn, index)=> {
          const eq = equipData.find( e => e._id === mn.equipId );
          if(index === 0 || thisWeek[index-1].close.toLocaleString() !== mn.close.toLocaleString()) {
            return(
              <Fragment key={index}>
                <dt className='vmarginhalf bottomLine bold'>{moment(mn.close).format('dddd')}</dt>
                <dd className='cap med line2x bottomLine'>{eq.alias} {mn.name}</dd>
              </Fragment>
            );
          }else{
            return(
              <dd key={index} className='cap med line2x bottomLine'>{eq.alias} {mn.name}</dd>
            );
          }
        })}
        </dl>
      </div>*/}
      
      <EqTimeReport />
      
      <CalWrap />

    </div>
  );
};

export default Landing;