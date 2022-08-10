import React, { useMemo, Fragment } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';

const Landing = ({ equipData, maintainData, app, brancheS })=> {
  
  const week0 = useMemo( ()=> moment().startOf('week'), [app]);
  const week6 = useMemo( ()=> moment().endOf('week'), [app]);
  
  const thisWeek = useMemo( ()=> maintainData
          .filter( f => !f.status &&
            moment(f.close).isBetween( week0, week6 ) )
          .sort((x1, x2)=>
            x1.close < x2.close ? -1 : 
            x1.close > x2.close ? 1 : 0 
        ), [maintainData]);
  
  return(
    <div className='overscroll'>
      
      <div className='wide centreRow'>
        <h2>Upcoming Service Due</h2>
        <span className='flexSpace' />
        <EquipForm
          id={false}
          lgIcon={true}
          rootURL={app.instruct}
          brancheS={brancheS} />
        <NumBox
          num={equipData.length}
          name={Pref.equip}
          color='blueT' />
      </div>

      <div>
        <dl className='max400'>
        {thisWeek.map( (mn, index)=> {
          const eq = equipData.find( e => e._id === mn.equipId );
          if(index === 0 || thisWeek[index-1].close.toLocaleString() !== mn.close.toLocaleString()) {
            return(
              <Fragment key={index}>
                <dt className='vmarginhalf bottomLine medBig bold'>{moment(mn.close).format('dddd')}</dt>
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
      </div>

    </div>
  );
};

export default Landing;