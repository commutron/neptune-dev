import React/*, { useContext, useMemo }*/ from 'react';
import TideLock from '/client/components/tide/TideLock.jsx';
import Pref from '/client/global/pref.js';

import River from '/client/components/river/River.jsx';
import ScrapBox from '/client/components/smallUi/ScrapBox.jsx';

// UNSAFE_componentWillReceiveProps(nextProps) {
//     itemData.serial !== nextProps.itemData.serial ?
//       this.forceUpdate() : null;
//   }

// const ItemCard = ({ 
//   batchData, itemData, widgetData, 
//   users, app,
//   currentLive, flow, flowAlt, progCounts,
//   showVerify, optionVerify, changeVerify
// })=> {
//   let itemContext = useContext(itemData);
  
//   return useMemo(() => {
//     return(
//       <ItemCardContent
//         itemContext={itemContext}
//         batchData={batchData}
//         itemData={itemData} 
//         widgetData={widgetData} 
//         users={users}
//         app={app}
//         currentLive={currentLive}
//         fow={flow}
//         flowAlt={flowAlt}
//         progCounts={progCounts}
//         showVerify={showVerify}
//         optionVerify={optionVerify}
//         changeVerify={changeVerify} />
//     );
//   }, [ itemContext, currentLive ]);
// };

const ItemCard = ({
  itemContext, batchData, itemData, widgetData, 
  users, app,
  currentLive, flow, flowAlt, progCounts,
  showVerify, optionVerify, changeVerify
})=> {

  const b = batchData;
  const i = itemData;
  const w = widgetData;
  //const done = i.finishedAt !== false;
  const scrap = i.history.find(x => x.type === 'scrap' && x.good === true);
  
  if(!b.river) {
    Session.set('ncWhere', Pref.outOfFlow);
    Session.set('nowStepKey', undefined);
    return(
      <div className='section sidebar centre centreText' key={i.serial}>
        <p><i className="fas fa-exclamation-circle fa-5x redT"></i></p>
        <p className='medBig'>
          This {Pref.batch} does not have a {Pref.flow}
        </p>
        <br />
      </div>
    );
  }
    
  if(b.floorRelease === false) {
    Session.set('ncWhere', Pref.outOfFlow);
    Session.set('nowStepKey', undefined);
    return(
      <div className='section sidebar centre centreText space' key={i.serial}>
        <p><i className="fas fa-exclamation-triangle fa-5x orangeT"></i></p>
        <p className='medBig'>
          This {Pref.batch} has not been released from Kitting
        </p>
        <p><em>
          "Release to the Floor" must be recorded
        </em></p>
        <br />
      </div>
    );
  }

  return(
    <div key={i.serial}>
      {scrap &&
        <div className='section sidebar' key={i.serial}>
          <ScrapBox entry={scrap} />
        </div>
      }
      
      <TideLock currentLive={currentLive}>
        <River
          itemData={i}
          batchData={b}
          widgetData={w}
          app={app}
          users={users}
          currentLive={currentLive}
          flow={flow}
          flowAlt={flowAlt}
          progCounts={progCounts}
          showVerify={showVerify}
          optionVerify={optionVerify}
          changeVerify={changeVerify} />
      </TideLock>
		</div>
  );
};

export default ItemCard;