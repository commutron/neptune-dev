import React from 'react';
import moment from 'moment';
import 'moment-business-time';

import ServiceDock from '/client/components/riverX/ServiceDock';

const ServiceCard = ({ eqData, maintData })=> {
  
  const serve = eqData.service.find( s => s.serveKey === maintData.serveKey );

  return(
    <div className='stoneForm midnightblue'>
			<div className='space1v centreText'>
  			<p className='bigbig'>{maintData.name}</p>
        
        {maintData.status === 'complete' &&
          <p className='medBig spacehalf green'>Service Completed<br />{moment(maintData.doneAt).format('MMMM Do h:mm a')}</p>}
        
        <p className='medBig'>Service Due {moment(maintData.close).format('dddd MMMM Do')}</p>
        
        <p className='medSm vmarginquarter'>Grace period ends {moment(maintData.expire).format('dddd MMMM Do')}</p>
      </div>
      
      <ServiceDock
        maintData={maintData}
        eqId={eqData._id}
        serve={serve}
      />
    </div>
  );
};

export default ServiceCard;