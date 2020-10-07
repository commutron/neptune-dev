import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';
//import Pref from '/client/global/pref.js';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import { ExTaskBar } from './TaskBars.jsx';
import ActionBar from '/client/components/bigUi/ToolBar/ActionBar.jsx';
import CookieBar from './CookieBar.jsx';

export const TraverseWrap = ({
  itemData,
  batchData,
  widgetData,
  variantData,
  allVariants,
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

  const invert = invertColor ? 'invert' : '';
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  const goFunc = itemData ? ()=>goPro(itemData.serial) :
                 batchData ? ()=>goPro(batchData.batch) :
                 groupData ? ()=>goPro(groupData.alias) : null;
  
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
              variantData={variantData}
              groupData={groupData}
              app={app}
              action={action}
              miniAction={false} />
          }
          
          <div className='auxRight'>
            {!goFunc || isRO ? null 
            :
              <button 
                title='View this in production'
                className='taskLink'
                onClick={goFunc}>
                <i className='fas fa-paper-plane' data-fa-transform='left-1'></i>
              </button>
            }
          </div>
          
        <TideFollow />
        
        </div>
        <aside className='taskBarEx noPrint'>
          <ExTaskBar subLink={subLink} />
        </aside>
        
        <div className={'contentAreaEx ' + invert}>
          <div 
            className={
              base ? 'baseContainer' :
              !children[1] ?
                'baseTraverseContainer' : 'traverseContainer'}>
            
            <div className='traverseContent forceScroll forceScrollStyle' >
              {children[0] || children}
            </div>
            
            {children[1] &&
              <aside 
                className='traverseList forceScroll forceScrollStyle' 
                id='exItemList'
              >
                {children[1]}
              </aside>}
            
            {!base &&
              <div className='actionBarEx'>
                <ActionBar
                  batchData={batchData}
                  itemData={itemData}
                  groupData={groupData}
                  widgetData={widgetData}
                  variantData={variantData}
                  allVariants={allVariants}
                  app={app}
                  user={user}
                  action={action}
                  ncTypesCombo={flowData && flowData.ncTypesComboFlat} />
              </div>}
              
          </div>
          
        </div>
        
      </div>
    </ErrorCatch>
  );
};