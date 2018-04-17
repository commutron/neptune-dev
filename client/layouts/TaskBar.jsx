import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';

const TaskBar = ({ subLink }) => {
            
  return(
    <div className='taskColumn'>
    
      <button
        title='advanced search'
        className={!subLink ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data')}
      ><i className='fas fa-search'></i></button>
      
      <button
        title='schedule'
        className={subLink === 'schedule' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/schedule')}
        disabled={true}
      ><i className='far fa-calendar-alt'></i></button>
      
      <button
        title={Pref.group + 's'}
        className={subLink === 'overviewgroups' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=groups')}
      ><i className='fas fa-users'></i></button>
      
      <button
        title={Pref.batch + 's'}
        className={subLink === 'overviewbatches' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=batches')}
      ><i className='fas fa-cubes'></i></button>
      {/*
      <button
        title='parts search'
        className='taskLink'
        onClick={()=>FlowRouter.go('/starfish')}
      ><i className='fas fa-microchip fa-2x'></i></button>
      */}
      <button
        title={Pref.scrap + 's'}
        className={subLink === 'overviewscraps' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=scraps')}
      ><i className='fas fa-minus-circle'></i></button>
      
    </div>
  );
};

export default TaskBar;