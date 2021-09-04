import React from 'react';

const ExploreLinkBlock = ({ type, keyword, altName, wrap, rad })=>{
  const title = keyword.split('+')[0];
  const label = typeof altName === 'string' ? altName : title;
  const link = type === 'group' ? 
                  '/data/group?request=' + title
                : type === 'widget' ? 
                  '/data/widget?request=' + title
                : type === 'batch' ? 
                  '/data/batch?request=' + title
                : type === 'item' ? 
                  '/data/batch?request=' + keyword.split('+')[1] + '&specify=' + title
                : '';
  const noWrap = wrap ? '' : 'noWrap';
  return(                    
    <a href={link} className={noWrap + ' numFont'} 
    >{rad ? <n-fa1 class='smplTip' data-tip={rad}>
              <i className='fas fa-radiation-alt fa-fw noPrint darkOrangeT'></i>
            </n-fa1>
          : <n-fa0><i className='fas fa-rocket fa-fw noPrint'></i></n-fa0>
      }{label}
    </a>
  );
};

export default ExploreLinkBlock;