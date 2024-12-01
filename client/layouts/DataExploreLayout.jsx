import React from 'react';
import { Meteor } from 'meteor/meteor';

import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';
import { ExTaskBar } from './TaskBars/TaskBars';
import CookieBar from './CookieBar/CookieBar';

export const TraverseWrap = ({
  itemData,
  batchData,
  widgetData,
  variantData,
  groupData,
  title,
  subLink,
  action,
  base,
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
                 groupData ? ()=>goPro(groupData.alias) :
                 action === 'maintain' ? ()=>FlowRouter.go('/production') : null;
  
  return(
    <div className='containerEx'>
      <div className='tenHeader noPrint'>
        <div className='topBorder' />
        <HomeIcon />
        
        {base ? 
          <div className='frontCenterTitle cap'>{title}
          {beta && <sup className='big monoFont'>BETA</sup>}</div>
        :
          <CookieBar
            batch={batchData.batch}
            item={itemData ? true : false}
            widget={widgetData.widget}
            variant={variantData.variant}
            alias={groupData.alias}
          />
        }
          
        <div className='auxRight'>
          {!goFunc || isRO ? null 
          :
            <button 
              aria-label='Production'
              className='taskLink auxTipScale'
              onClick={goFunc}>
              <i className='fa-regular fa-paper-plane' data-fa-transform='left-1'></i>
            </button>
          }
        </div>
        
        <TideFollow />
        
      </div>
      
      <aside className='taskBarEx noPrint'>
        <ExTaskBar subLink={subLink} />
      </aside>
      
      <div className='contentAreaEx'>
        <div className={base || !children[1] ? 'baseContainer' : 'traverseContainer'}>
          
          <div className='traverseContent forceScroll forceScrollStyle' >
            {children[0] || children}
          </div>
          
          {children[1] &&
            <aside 
              className='traverseList forceScroll forceScrollStyle' 
              id='exItemList'
            >
              {children[1]}
            </aside>
          }
          
        </div>
      </div> 
    </div> 
  );
};