import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/public/pref.js';
import { toCap } from '/client/utility/Convert';

const TaskElement = ({ title, subON, goLink, icon, shrink, iconAdj, lock }) => (
  <button
    aria-label={toCap(title, true)}
    style={shrink ? {minHeight:'unset'} : {}}
    className={`taskLink taskTip ${subON ? 'onTL' : ''}`}
    onClick={()=>FlowRouter.go( goLink )}
    disabled={lock}
  ><i className={icon} data-fa-transform={iconAdj}></i></button>
);

const taskColSty = {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  alignItems: 'center',
  height: '100%'
};

export const ExTaskBar = ({ subLink }) => (
  <div style={taskColSty} className='topVpad'>
  
    <TaskElement
      title='Explore'
      subON={!subLink}
      goLink='/data'
      icon='fas fa-rocket'
      iconAdj='left-1'
    />
    
    <TaskElement
      title={Pref.Group + 's'}
      subON={subLink === 'overviewgroups'}
      goLink='/data/overview?request=groups'
      icon='fas fa-industry'
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
    />
    
    <TaskElement
      title={`${Pref.nonCons}`}
      subON={subLink === 'nonconsundefined'}
      goLink='/data/noncons'
      icon='fa-solid fa-xmarks-lines'
      iconAdj='shrink-1'
    />
    
    <TaskElement
      title={Pref.widget + ' ' + Pref.radio.toUpperCase() + 's'}
      subON={subLink === 'overviewradioactive'}
      goLink='/data/overview?request=radioactive'
      icon='fas fa-burst'
    />
    
    <TaskElement
      title={`${Pref.rapidExd} ${Pref.xBatchs}`}
      subON={subLink === 'overviewrapidex'}
      goLink='/data/overview?request=rapidex'
      icon='fa-solid fa-bolt'
    />
    
    <TaskElement
      title='Test Fail History'
      subON={subLink === 'overviewtestfail'}
      goLink='/data/overview?request=testfail'
      icon='fas fa-microchip'
    />
    
    <TaskElement
      title={Pref.Scrap + 's'}
      subON={subLink === 'overviewscraps'}
      goLink='/data/overview?request=scraps'
      icon='fas fa-trash-alt'
    />
    
  </div>
);

export const UpTaskBar = ({ subLink, showParts, isAuth }) => (
  <div style={taskColSty} className='topVpad'>
  
    <TaskElement
      title='Upstream'
      subON={!subLink}
      goLink='/upstream'
      icon='fas fa-satellite-dish'
      iconAdj='shrink-1 up-1'
    />
    
    {showParts &&
      <TaskElement
        title='Parts Search'
        subON={subLink === 'parts'}
        goLink='/upstream/parts'
        icon='fas fa-shapes'
        iconAdj='up-1'
      />
    }
    
    <TaskElement
      title={Pref.shortfalls}
      subON={subLink === 'shortfalls'}
      goLink='/upstream/shortfalls'
      icon='fas fa-exclamation-triangle'
    />
    
    <TaskElement
      title='Instruction Docs'
      subON={subLink === 'docs'}
      goLink='/upstream/docs'
      icon='fa-solid fa-file-invoice'
    />
    
    <TaskElement
      title='Conversion Calculators'
      subON={subLink === 'values'}
      goLink='/upstream/values'
      icon='fas fa-calculator'
    />
    
    {isAuth || Roles.userIsInRole(Meteor.userId(), 'admin') ?
      <TaskElement
        title='PCB Emails'
        subON={subLink === 'emailrec'}
        goLink='/upstream/emailrec'
        icon='fas fa-at'
      />
    : null}
      
  </div>
);

export const DownTaskBar = ({ subLink }) => (
  <div style={taskColSty} className='topVpad'>
  
    <TaskElement
      title='Downstream'
      subON={!subLink}
      goLink='/downstream'
      icon='fas fa-satellite'
      iconAdj='up-1'
    />
    
    <TaskElement
      title='Daily Completed'
      subON={subLink === 'reportday'}
      goLink='/downstream/reportday'
      icon='fas fa-calendar-day'
      iconAdj='up-1'
    />
    
    <TaskElement
      title='Weekly Completed'
      subON={subLink === 'reportweek'}
      goLink='/downstream/reportweek'
      icon='fas fa-calendar-week'
      iconAdj='up-1'
    />
    
    <TaskElement
      title='Monthly Completed'
      subON={subLink === 'reportmonths'}
      goLink='/downstream/reportmonths'
      icon='far fa-calendar-alt'
      iconAdj='up-1'
    />
    
    <TaskElement
      title='Trends'
      subON={subLink === 'trends'}
      goLink='/downstream/trends'
      icon='fas fa-chart-line'
    />
    
    <span className='flexSpace'></span>
    
    <TaskElement
      title='βeta Planner'
      subON={subLink === 'zplan'}
      goLink='/downstream/zplan'
      icon='fas fa-meteor' // fa-table-cells
    />
    
  </div>
);

const FilterElement = ({ title, subTitle, goLink, branchON, changeBranch, icon, iconAdj, size, shrink, lock }) => (
  <button
    aria-label={toCap(title, true)}
    style={shrink ? {minHeight:'unset',padding:'5px 0'} : {}}
    className={
      `taskLink taskTip numFont 
      ${branchON ? 'onTL' : ''} 
      ${size || ''} 
      ${icon ? '' : 'nomarginB'}
    `}
    onClick={()=>{FlowRouter.go( '/overview' );changeBranch( goLink )}}
    disabled={lock}
  >{icon ? <i className={icon} data-fa-transform={iconAdj}></i> : 
           <i className={size}>{toCap(subTitle)}</i>}
  </button>
);

export const OverMenuBar = ({ brancheS, branchON, changeBranch, light }) => {
  
  const barsty = {
    colorScheme: 'dark',
    gridArea: 'overTaskArea',
    height: '100%',
    backgroundColor: 'var(--overBG, rgb(25,25,25))',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingTop: 'var(--vh)',
    overflowY: 'auto',
    overflowX: 'hidden',
  };
  
  return(
    <div style={barsty} className={`overMenuBar thinScroll ${light === true ? 'lightTheme' : 'darkTheme'}`}>
    
      <FilterElement
        title='All'
        subTitle='AL'
        goLink={false}
        branchON={branchON === false}
        changeBranch={changeBranch}
        icon='fa-solid fa-globe'
        shrink={brancheS.length >= 14}
      />
      
      {brancheS.filter(p => p.pro).map( (br, ix)=> {
        return(
          <FilterElement
            key={br.brKey+ix}
            title={br.branch}
            subTitle={br.common.charAt(0) + br.common.charAt(1)}
            goLink={br.branch}
            branchON={branchON === br.branch}
            changeBranch={changeBranch}
            shrink={brancheS.length >= 12}
          />
      )})}
      
    </div>
  );
};
/* <span className='flexSpace'></span>
<TaskElement
  title={`${} Calendar`}
  subON={calView}
  goLink='/overview/calendar'
  icon='fa-solid fa-calendar'
  shrink={brancheS.length >= 13}
/> */