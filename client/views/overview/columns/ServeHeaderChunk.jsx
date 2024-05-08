import React from 'react';
import Pref from '/client/global/pref.js';

import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const ServeHeaderChunk = ({ sv, rowclss, nameLth, isDebug })=> {
  
  isDebug && console.log(sv);
  
  return(
    <div className={rowclss}>
      <KpiStat
        num='🛠'
        name='Service'
        color='var(--midnightblue)'
        core={true}
      />
      <div>
        <ExploreLinkBlock type='equip' keyword={sv.equip} />
      </div>
      <div className='cap'>{
        sv.title.length <= (nameLth || 75) ? 
        sv.title : 
        sv.title.substring(0, 65) + '...'
      } {Pref.maintain}</div>
    </div>
  );
};

export default ServeHeaderChunk;