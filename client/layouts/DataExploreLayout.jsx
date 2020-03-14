import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';
//import Pref from '/client/global/pref.js';
import ErrorCatch from '/client/components/utilities/ErrorCatch.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import TaskBar from './TaskBar.jsx';
import ActionBar from '/client/components/bigUi/ToolBar/ActionBar.jsx';
import CookieBar from './CookieBar.jsx';

export const TraverseWrap = ({
  itemData,
  batchData,
  versionData,
  widgetData,
  groupData,
  user,
  app,
  flowData,
  title,
  subLink,
  action,
  base,
  beta,
  invertColor,
  children
})=>	{
  
  // useEffect( ()=> {
  //   if(batchData) {
  //     let el = document.getElementById('exItemList');
  //     const pos = Session.get('itemListScrollPos') || {b: false, num: 0};
  //     console.log(pos);
  //     if(batchData.batch === pos.b) { el.scrollTop = pos.num || 0 }
  //   }
  // }, [batchData]);
  
  function goPro(location) {
    // if(batchData) {
    //   let el = document.getElementById('exItemList');
    //   Session.set('itemListScrollPos', {b: batchData.batch, num: el.scrollTop});
    // }
    Session.set('now', location);
    FlowRouter.go('/production');
  }
    
  let scrollFix = {
    overflowY: 'scroll'
  };

  const invert = invertColor ? 'invert' : '';
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <ErrorCatch>
      <div className='containerEx'>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          newestOnTop />
        <div className='tenHeader noPrint'>
          <div className='topBorder' />
          <HomeIcon />
          {base ? 
            <div className='frontCenterTitle cap'>{title}
            {beta && <sup className='big monoFont'>BETA</sup>}</div>
          :
            <CookieBar
              batchData={batchData}
              itemData={itemData}
              widgetData={widgetData}
              versionData={versionData}
              groupData={groupData}
              app={app}
              action={action}
              miniAction={false} />
          }
          
          <div className='auxRight'>
            {isRO ? null 
            :
             itemData ? 
              <button 
                title='View this in production'
                onClick={()=>goPro(itemData.serial)}>
                <i className='fas fa-paper-plane primeRightIcon' data-fa-transform='left-1'></i>
              </button>
            :
             batchData ? 
              <button 
                title='View this in production'
                onClick={()=>goPro(batchData.batch)}>
                <i className='fas fa-paper-plane primeRightIcon' data-fa-transform='left-1'></i>
              </button>
            :
             groupData ? 
              <button 
                title='View this in production'
                onClick={()=>goPro(groupData.alias)}>
                <i className='fas fa-paper-plane primeRightIcon' data-fa-transform='left-1'></i>
              </button>
            :null}
          </div>
          
        <TideFollow />
        
        </div>
        <aside className='taskBarEx noPrint'>
          <TaskBar subLink={subLink} />
        </aside>
        
        <section className={'contentAreaEx ' + invert}>
          <div 
            className={
              base ? 'baseContainer' :
              !children[1] ?
                'baseTraverseContainer' : 'traverseContainer'}>
            
            <section className='traverseContent forceScrollStyle' style={scrollFix}>
              {children[0] || children}
            </section>
            
            {children[1] &&
              <aside className='traverseList forceScrollStyle' style={scrollFix} id='exItemList'>
                {children[1]}
              </aside>}
            
            {!base &&
              <div className='actionBarEx'>
                <ActionBar
                  batchData={batchData}
                  itemData={itemData}
                  groupData={groupData}
                  widgetData={widgetData}
                  versionData={versionData}
                  app={app}
                  user={user}
                  action={action}
                  ncTypesCombo={flowData && flowData.ncTypesComboFlat} />
              </div>}
              
          </div>
          
        </section>
        
      </div>
    </ErrorCatch>
  );
};