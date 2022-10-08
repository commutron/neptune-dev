import React from 'react';

import NumStatRing from '/client/components/charts/Dash/NumStatRing';
import NumLine from '/client/components/tinyUi/NumLine';
import TrendLine from '/client/components/charts/Trends/TrendLine';


const AccountsTop = ({ users })=> {
  
  const all = users.length;
  const active = users.filter( x => Roles.userIsInRole(x._id, 'active') ).length;
  const nightly = users.filter( x => Roles.userIsInRole(x._id, 'nightly') ).length;
  const debug = users.filter( x => Roles.userIsInRole(x._id, 'debug') ).length;
  const readOnly = users.filter( x => Roles.userIsInRole(x._id, 'readOnly') ).length;
  
  const pSup = users.filter( x => Roles.userIsInRole(x._id, 'peopleSuper') );
  const pSupNames = Array.from(pSup, x => x.username.replace('.', ' ') );
  const pSupNamesNice = pSupNames.length > 0 ? pSupNames.join(" & ") : 'no one';
  const pMulti = pSupNames.length < 2;
  
  return(
    <div className='autoGrid'>
        
      <div className='big wordBr' style={{alignSelf:'start'}}>
        <NumLine
          num={pSupNamesNice}
          name={`${pMulti ? 'is the' : 'are'} People Super${pMulti ? '' : 's'}`}
          color='blueT'
          big={true} />
          
        <NumLine
          num={nightly}
          name='can access Nightly features'
          color='tealT'
          big={true} />
          
        <NumLine
          num={debug}
          name={`${debug === 1 ? 'has' : 'have'} Debug reporting`}
          color='redT'
          big={true} />
        
        <NumLine
          num={readOnly}
          name='are limited to Read Only'
          color='grayT'
          big={true} />
      </div>
      
      <div className='centre'>
        <NumStatRing
          total={active}
          nums={[ active, ( all - active ) ]}
          name='Active Users'
          title={`${active} active users,\n${( all - active )} inactive users`}
          colour='blueBi'
          maxSize='chart15Contain'
          noGap={all - active === 0}
        />
        
        <TrendLine 
          title='new users'
          statType='newUser'
          cycleCount={12}
          cycleBracket='month'
          lineColor='rgb(52, 152, 219)'
        />
      </div>
    </div>
  );
};

export default AccountsTop;