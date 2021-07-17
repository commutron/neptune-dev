import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';


const TaskElement = ({ title, subON, goLink, icon, iconAdj  }) => (
  <button
    aria-label={title}
    className={`taskLink taskTip ${subON ? 'onTL' : ''}`}
    onClick={()=>FlowRouter.go (goLink )}
  ><i className={icon} data-fa-transform={iconAdj}></i></button>
);


export const ExTaskBar = ({ subLink }) => (
  <div className='taskColumn'>
  
    <TaskElement
      title='Explore'
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
      icon='fas fa-clipboard-list'
    />
    
    <TaskElement
      title='Visualization'
      subON={subLink === 'visualizationundefined'}
      goLink='/data/visualization'
      icon='fas fa-chart-area'
      iconAdj='down-1'
    />
    
    <TaskElement
      title={`${Pref.rapidExd} ${Pref.xBatchs}`}
      subON={subLink === 'overviewrapidex'}
      goLink='/data/overview?request=rapidex'
      icon='fas fa-bolt'
      iconAdj='down-1'
    />
    
    <TaskElement
      title='Test Fail History'
      subON={subLink === 'overviewtestfail'}
      goLink='/data/overview?request=testfail'
      icon='fas fa-microscope'
      iconAdj='down-1'
    />
    
    <TaskElement
      title={Pref.Scrap + 's'}
      subON={subLink === 'overviewscraps'}
      goLink='/data/overview?request=scraps'
      icon='fas fa-trash-alt'
      iconAdj='down-1'
    />
    
  </div>
);


export const UpTaskBar = ({ subLink }) => (
  <div className='taskColumn'>
  
    <TaskElement
      title='Upstream'
      subON={!subLink}
      goLink='/upstream'
      icon='fas fa-satellite-dish'
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
      title={Pref.shortfalls}
      subON={subLink === 'shortfalls'}
      goLink='/upstream/shortfalls'
      icon='fas fa-exclamation'
      iconAdj='down-1'
    />
    
    <TaskElement
      title='Conversion Calculators'
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
      title='Daily Completed'
      subON={subLink === 'reportday'}
      goLink='/downstream/reportday'
      icon='fas fa-calendar-day'
    />
    
    <TaskElement
      title='Weekly Completed'
      subON={subLink === 'reportweek'}
      goLink='/downstream/reportweek'
      icon='fas fa-calendar-week'
    />
    
    <TaskElement
      title='Monthly Completed'
      subON={subLink === 'reportmonths'}
      goLink='/downstream/reportmonths'
      icon='far fa-calendar-alt'
    />
    
    <TaskElement
      title='Trends'
      subON={subLink === 'trends'}
      goLink='/downstream/trends'
      icon='fas fa-chart-line'
      iconAdj='down-1'
    />
    
    {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
      <TaskElement
        title='Experimental'
        subON={subLink === 'outlook'}
        goLink='/downstream/outlook'
        icon='fas fa-meteor'
        //iconAdj=''
      />
    }
    
    {/* switch to external link
    <div className='flexSpace'></div>
    
    <TaskElement
      title='Downstream Data Explain'
      subON={subLink === 'explain'}
      goLink='/downstream/explain'
      icon='fas fa-question'
      iconAdj='down-1'
    />
    */}
    
    
  </div>
);


