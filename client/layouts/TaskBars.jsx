import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';


const TaskElement = ({ title, subON, goLink, icon, iconAdj  }) => (
  <button
    title={title}
    className={subON ? 'taskLink onTL' : 'taskLink'}
    onClick={()=>FlowRouter.go (goLink )}
  ><i className={icon} data-fa-transform={iconAdj}></i></button>
);


export const ExTaskBar = ({ subLink }) => {
            
  return(
    <div className='taskColumn'>
    
      <TaskElement
        title='Exlore'
        subON={!subLink}
        goLink='/data'
        icon='fas fa-rocket'
        iconAdj='left-1 down-2'
      />
      
      <TaskElement
        title={Pref.Group + 's'}
        subON={subLink === 'overviewgroups'}
        goLink='/data/overview?request=groups'
        icon='fas fa-industry'
        iconAdj=''
      />
      
      <TaskElement
        title={Pref.Batch + 's'}
        subON={subLink === 'overviewbatches'}
        goLink='/data/overview?request=batches'
        icon='fas fa-cubes'
        iconAdj=''
      />
      
      <TaskElement
        title={Pref.Item + 's'}
        subON={subLink === 'overviewitems'}
        goLink='/data/overview?request=items'
        icon='fas fa-qrcode'
        iconAdj='down-1'
      />
      
      <TaskElement
        title='Build History'
        subON={subLink === 'buildHistoryundefined'}
        goLink='/data/buildHistory'
        icon='fas fa-backward'
        iconAdj='left-1'
      />
      
      <TaskElement
        title='Reports'
        subON={subLink === 'reportsundefined'}
        goLink='/data/reports'
        icon='fas fa-chart-line'
        iconAdj='down-1'
      />
      
      <TaskElement
        title='Test Fail Tracker'
        subON={subLink === 'overviewtestfail'}
        goLink='/data/overview?request=testfail'
        icon='fas fa-microscope'
        iconAdj='down-1'
      />
      
      <TaskElement
        title={Pref.Scrap + 's'}
        subON={subLink === 'overviewscraps'}
        goLink='/data/overview?request=scraps'
        icon='fas fa-trash'
        iconAdj='down-1'
      />
      
    </div>
  );
};


export const UpTaskBar = ({ subLink }) => (
  <div className='taskColumn'>
  
    <TaskElement
      title='Upstream'
      subON={!subLink}
      goLink='/upstream'
      icon='fas fa-warehouse'
      iconAdj='shrink-2'
    />
    
    <TaskElement
      title='Parts Search'
      subON={subLink === 'parts'}
      goLink='/upstream/parts'
      icon='fas fa-microchip'
      iconAdj=''
    />
    
    <TaskElement
      title='Part Value Conversion'
      subON={subLink === 'values'}
      goLink='/upstream/values'
      icon='fas fa-calculator'
      iconAdj=''
    />
      
  </div>
);

export const DownTaskBar = ({ subLink }) => (
  <div className='taskColumn'>
  
    <TaskElement
      title='Upstream'
      subON={!subLink}
      goLink='/downstream'
      icon='fas fa-satellite'
      //iconAdj=''
    />
    
    <TaskElement
      title='old feed'
      subON={subLink === 'overview'}
      goLink='/downstream/overview'
      icon='fas fa-rss'
      //iconAdj=''
    />
    
      
  </div>
);


