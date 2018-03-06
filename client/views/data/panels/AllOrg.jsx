import { Meteor } from 'meteor/meteor';
import React from 'react';

const AllOrg = ({  }) => {


  return(
    <div className='dashMainFull'>
      <div className='centre wide'>
        
        <button
          className='action clear'
          onClick={()=>FlowRouter.go('/data/group?request=protogen')}
        >Protogen</button>
        
      </div>
    </div>
  );
};

export default AllOrg;