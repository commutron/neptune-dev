import React, { useState, useEffect, useRef } from 'react';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import NumBox from '/client/components/tinyUi/NumBox.jsx';

const TopViewStats = ({ users, groups, widgets, batches, live })=> {
  
  const thingMounted = useRef(true);
  
  const [ counts, countSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('topViewStats', users, groups, widgets, batches, live, (error, reply)=> {
      error ? console.log(error) : null;
      if(thingMounted.current) {
        countSet(reply);
      }
    });
  },[]);
    
  if(!counts) {
    return(
      <CalcSpin />
    );
  }
    
  return(
    <div className='centreRow'>
      {users &&
        <NumBox
          num={counts.usrC}
          name={Pref.user + 's'}
          color='blueT' />}
      {groups &&
        <NumBox
          num={counts.grpC}
          name={Pref.group + 's'}
          color='blueT' />}
      {widgets &&
        <NumBox
          num={counts.wdgtC}
          name={Pref.widget + 's'}
          color='blueT' />}
      {batches &&
        <NumBox
          num={counts.btchC}
          name={'Total ' + Pref.batch + 's'}
          color='blueT' />}
      {live &&
        <NumBox
          num={counts.btchLv}
          name={'Live ' + Pref.batch + 's'}
          color='blueT' />}
      {live &&
        <NumBox
          num={counts.btchC - counts.btchLv}
          name={'Finished ' + Pref.batch + 's'}
          color='greenT' />}
    </div>
  );
};

export default TopViewStats;