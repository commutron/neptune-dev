import React, { Fragment } from 'react';

import { PlainFrame } from '/client/layouts/MainLayouts';
import Spin from '/client/components/tinyUi/Spin';
import { UpTaskBar, DownTaskBar } from './TaskBars/TaskBars';

const StreamLayout = ({
  load,
  user, app,
  title, subLink, tag,
  navBar,
  isAuth,
  children
})=>	{
  
  if(!user || !app) {
    return(
      <PlainFrame title={title} tag={tag}>
        <div className='centre wide'>
          <Spin />
        </div>
      </PlainFrame>
    );
  }
  
  return(
    <PlainFrame title={title} tag={tag} container='containerEx'>
      <Fragment>
        <aside className='taskBarEx noPrint'>
          {navBar === 'down' ?
            <DownTaskBar subLink={subLink} /> :
            <UpTaskBar 
              subLink={subLink} 
              showParts={app.partsGlobal}
              isAuth={isAuth}
            />
          }
        </aside>
        
        <div className='contentAreaEx'>
          <div 
            className='baseContainer'>
            
            <div className='traverseContent forceScroll wideScroll forceScrollStyle'>
              {children[0] || children}
            </div>
          </div>
          
        </div>
      </Fragment>
    </PlainFrame>
  );
};

export default StreamLayout;