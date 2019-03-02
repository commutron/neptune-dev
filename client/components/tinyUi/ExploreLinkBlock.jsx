import React from 'react';

const ExploreLinkBlock = ({type, keyword, wrap})=>{
  const title = keyword.split('+')[0];
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
    <a href={link} className={noWrap + ' numFont'}>
      <i className='fas fa-rocket fa-fw'></i>{title}
    </a>
  );
};

export default ExploreLinkBlock;