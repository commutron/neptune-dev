import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const ServicePanel = ()=> {
  
  const [equipData, setEquipData] = useState(false);
  
  useEffect( ()=>{ 
    Meteor.call('getEquipAssigned', (err, rtn)=>{
	    err && console.log(err);
	    if(rtn) {
	    const alpha = rtn.sort((x1, x2)=>
                      x1.equip > x2.equip ? 1 : 
                      x1.equip < x2.equip ? -1 : 0 );
      setEquipData(alpha);
	    }
	  });
  }, []);
  
  const goPro = (eq, sv)=> {
    const find = 'Eq-' + (eq.alias || '') +' ~ '+ sv.name;
    
    Session.set('now', find);
    Session.set('nowSV', sv._id);
  
    FlowRouter.go('/production');
	};
  
  return(
    <div className='space5x5'>
      {!equipData ?
        <div className='centreText'>
          <CalcSpin />
          <p className='medBig line2x'>Fetching No {Pref.equip} responsibilities</p>
        </div>
      :
      equipData.length === 0 ?
        <div className='darkgrayT'>
          <p className='centreText'><i className="fas fa-ghost fa-3x"></i></p>
          <p className='medBig centreText line2x'>No {Pref.equip} responsibilities</p>
        </div>
      :
      equipData.map( (eq, index)=>(
        <div key={index} className={`bottomLine ${index > 0 ? 'vmargin' : ''}`}>
          <h3 className='cap'><ExploreLinkBlock type='equip' keyword={eq.alias} altName={eq.equip} /></h3>
          <dl>
            <dt>Next Service</dt>
            {eq.serve.sort((x1, x2)=>
                        x1.close < x2.close ? -1 : 
                        x1.close > x2.close ? 1 : 0 )
                      .map( (sv, ix)=>(
              <dd key={ix} className='cap'
              ><button
                className='cap textLinkButton'
                onClick={()=>goPro(eq, sv)}
              ><i className='fa-solid fa-paper-plane greenT fa-fw gapR'></i>
               <i>{sv.name} - {moment(sv.close).format('dddd MMMM Do')}</i>
              </button>
  
              </dd>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
};

export default ServicePanel;