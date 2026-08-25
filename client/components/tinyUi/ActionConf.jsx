import React, { Fragment } from 'react';
import { PopContextButton, PopContextMenu } from '/client/layouts/Models/Popover';
      
const ActionConf = ({ id, title, icon, color, lockOut, doFunc, confirm }) => (
  <Fragment>
    <PopContextButton
      targetid={id+'_actionconfirm'}
      title={title}
      extraClass='transparent centre actionIconWrap blackT'
      icon={icon + ' fa-lg ' + color}
      text={title}
      disabled={lockOut}
    />
      
    <PopContextMenu targetid={id+'_actionconfirm'} extraClass='noCopy'>
      <button
        popovertarget={id+'_actionconfirm'}
        popovertargetaction="hide"
      
        type='button'
        disabled={lockOut}
        onClick={()=>_.isFunction(doFunc) ? doFunc() : null}
      >{confirm}</button>
    </PopContextMenu>
  </Fragment>
);

export default ActionConf;