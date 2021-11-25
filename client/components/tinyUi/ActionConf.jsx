import React, { Fragment } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

const ActionConf = ({ id, doFunc, title, confirm, icon, color, noText, lockOut }) => (
  <Fragment>
    <ContextMenuTrigger
      id={id || 'actionconfirm'}
      attributes={{ title: title, className:'transparent', disabled:lockOut }}
      holdToDisplay={1}
      renderTag='button'>
      <label className='navIcon actionIconWrap'>
        <i className={icon + ' fa-lg ' + color}></i>
        {!noText && <span className={'actionIconText ' + color}>{title}</span>}
      </label>
    </ContextMenuTrigger>
    
    <ContextMenu id={id || 'actionconfirm'} className='noCopy'>
      <MenuItem onClick={()=>_.isFunction(doFunc) ? doFunc() : null}
      >{confirm}</MenuItem>
    </ContextMenu>
  </Fragment>
);

export default ActionConf;