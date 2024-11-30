import React from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import NumStatRing from '/client/components/charts/Dash/NumStatRing';
import NumLine from '/client/components/tinyUi/NumLine';

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
  
  const thirty = ( d => new Date(d.setDate(d.getDate()-Number(30))) )(new Date);
  const newusers = users.filter( u => u.createdAt > thirty );
  
  function massNotify(e) {
    e.preventDefault();
    const message = this.massmesSage.value;
    
    Meteor.call('sendAllUserDM', message, (error, re)=>{
      error && console.log(error);
      if(re) {
        toast.success('messages sent');
        this.massmesSage.value = '';
      }
    });
  }
  
  return(
    <div>
      <div className='autoGrid'>
          
        <div className='medBig wordBr' style={{alignSelf:'start'}}>
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
        </div>
      </div>
      
      {newusers > 0 &&
        <div className='vmargin'>
          <table className='wide cap space'>
            <tbody>
            <tr className='leftText line2x'>
              <th colSpan='2'>New Users</th>
            </tr>
            {newusers.map( (entry, index)=>{
              return(
                <tr key={entry.uID+'-'+index} className='centreText line2x'>
                  <td className='noBorder'>{entry.username}</td>
                  <td>{moment(entry.createdAt).format('MMMM Do YYYY')}</td>
                </tr>
            )})}
            </tbody>
          </table>
        </div>
      }
      
      <div className='cardSelf max500'>
        <h3 className='cap'><i className="fa-solid fa-reply-all fa-flip-horizontal gapR"></i>Message All Active Users</h3>
        <form onSubmit={(e)=>massNotify(e)}>
          <p className='nospace'>
            <label htmlFor='massmesSage'>Message</label><br />
            <textarea id='massmesSage' rows={3} className='w100'
              required></textarea>
          </p>
          <p className='nospace'>
            <button
              type='submit'
              className='action nSolid'
            >Send</button>
          </p>
          <p className='smaller darkgrayT line15x'
          >Messages are retained for 90 days and can be accessed by management. Message content is subject to Commutron policy and Canadian privacy laws.</p>
        </form>
      </div>
    </div>
  );
};

export default AccountsTop;