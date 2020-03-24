import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';

const TaskBar = ({ subLink }) => {
            
  return(
    <div className='taskColumn'>
    
      <button
        title='Explore'
        className={!subLink ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data')}
      ><i className='fas fa-rocket' data-fa-transform='left-1 down-2'></i></button>
      
      <button
        title={Pref.Group + 's'}
        className={subLink === 'overviewgroups' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=groups')}
      ><i className='fas fa-industry'></i></button>

      <button
        title={Pref.Batch + 's'}
        className={subLink === 'overviewbatches' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=batches')}
      ><i className='fas fa-cubes'></i></button>
      
      <button
        title={Pref.Item + 's'}
        className={subLink === 'overviewitems' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=items')}
      ><i className='fas fa-qrcode' data-fa-transform='down-1'></i></button>
      
      <button
        title='Events Calendar'
        className={subLink === 'calendarundefined' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/calendar')}
      ><i className='far fa-calendar-alt'></i></button>
      
      <button
        title='Reports'
        className={subLink === 'reportsundefined' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/reports')}
      ><i className="fas fa-chart-line" data-fa-transform='down-1'></i></button>
      
      {/*
      <button
        title='parts search'
        className='taskLink'
        onClick={()=>FlowRouter.go('/starfish')}
      ><i className='fas fa-microchip fa-2x'></i></button>
      */}
      
      <button
        title='Test Fail Tracker'
        className={subLink === 'overviewtestfail' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=testfail')}
      ><i className='fas fa-microscope' data-fa-transform='down-1'></i></button>
      
      <button
        title={Pref.Scrap + 's'}
        className={subLink === 'overviewscraps' ? 'taskLink onTL' : 'taskLink'}
        onClick={()=>FlowRouter.go('/data/overview?request=scraps')}
      ><i className='fas fa-trash' data-fa-transform='down-1'></i></button>
          
    </div>
  );
};

export default TaskBar;