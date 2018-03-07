import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';

const TaskBar = ({  }) => {
            
  return(
    <div className='taskColumn'>
    
      <button
        title='advanced search'
        className='taskLink'
        onClick={()=>FlowRouter.go('/data/search')}
        disabled={true}
      ><i className='fas fa-search fa-2x'></i></button>
      
      <button
        title='schedule'
        className='taskLink'
        onClick={()=>FlowRouter.go('/data/schedule')}
        disabled={true}
      ><i className='far fa-calendar-alt fa-2x'></i></button>
      
      <button
        title={Pref.group + 's'}
        className='taskLink'
        onClick={()=>FlowRouter.go('/data/overview?request=groups')}
      ><i className='fas fa-users fa-2x'></i></button>
      
      <button
        title={Pref.batch + 's'}
        className='taskLink'
        onClick={()=>FlowRouter.go('/data/overview?request=batches')}
      ><i className='fas fa-cubes fa-2x'></i></button>
      {/*
      <button
        title='parts search'
        className='taskLink'
        onClick={()=>FlowRouter.go('/starfish')}
      ><i className='fas fa-microchip fa-2x'></i></button>
      */}
      <button
        title={Pref.scrap + 's'}
        className='taskLink'
        onClick={()=>FlowRouter.go('/data/overview?request=scraps')}
      ><i className='fas fa-minus-circle fa-2x'></i></button>
      
    </div>
  );
};

export default TaskBar;