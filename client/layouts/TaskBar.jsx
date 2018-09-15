import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';

const TaskBar = ({ subLink }) => {
            
  return(
    <div className='taskColumn'>
    
      <button
        title='Advanced Search'
        className={!subLink ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data')}
      ><i className='fas fa-search-plus'></i></button>
      
      <button
        title='Reports'
        className={subLink === 'reportsundefined' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/reports')}
      ><i className="fas fa-chart-bar"></i></button>
      
      <button
        title='Schedule'
        className={subLink === 'schedule' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/schedule')}
        disabled={true}
      ><i className='far fa-calendar-alt'></i></button>
      
      <button
        title={Pref.Group + 's'}
        className={subLink === 'overviewgroups' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=groups')}
      ><i className='fas fa-users'></i></button>
      
      <button
        title={Pref.Batch + 's'}
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
        title={Pref.Scrap + 's'}
        className={subLink === 'overviewscraps' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=scraps')}
      ><i className='fas fa-trash'></i></button>
          
    </div>
  );
};

export default TaskBar;