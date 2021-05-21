import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import { ExTaskBar } from './TaskBars.jsx';
import ActionBar from '/client/components/bigUi/ToolBar/ActionBar.jsx';
import CookieBar from './CookieBar.jsx';

export const TraverseWrap = ({
  itemData,
  rapidData,
  seriesData,
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
  base, mid,
  beta,
  children
})=>	{

  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('/production');
  }

  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  const goFunc = itemData ? ()=>goPro(itemData.serial) :
                 batchData ? ()=>goPro(batchData.batch) :
                 groupData ? ()=>goPro(groupData.alias) : null;
  
  return(
    <div className='containerEx'>
      <ToastContainer
        position="top-center"
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
              aria-label='Production'
              className='taskLink auxTipScale'
              onClick={goFunc}>
              <i className='far fa-paper-plane' data-fa-transform='left-1'></i>
            </button>
          }
        </div>
        
      <TideFollow user={user} />
        
      </div>
      <aside className='taskBarEx noPrint'>
        <ExTaskBar subLink={subLink} />
      </aside>
      
      <div className='contentAreaEx'>
        <div 
          className={
            base || !children[1] ? 'baseContainer' :
            mid ? 'midTraverseContainer' : 'traverseContainer'}>
          
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
          
          {!base && !mid ?
            <div className='actionBarEx centreRow'>
              <ActionBar
                batchData={batchData}
                seriesData={seriesData}
                rapidData={rapidData}
                itemData={itemData}
                groupData={groupData}
                widgetData={widgetData}
                variantData={variantData}
                allVariants={allVariants}
                app={app}
                user={user}
                action={action}
                ncTypesCombo={flowData && flowData.ncTypesComboFlat} />
            </div>
          : null }
            
        </div>
      </div>
    </div>
  );
};