import React, { Fragment, useEffect, useState }from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import Pref from '/public/pref.js';
import { toCap } from '/client/utility/Convert';

const NesoEquip = ({ user, unice, equipData })=> {

console.log({equipData});

	return(
		<Fragment>
			<EquipList />
		</Fragment>
  );
};

export default NesoEquip;

const EquipList = ({ user, unice })=> {
	
// 	const [ ibxLength, ibxSet ] = useState(0);
// 	useEffect( ()=> {
//     if(user?.inbox) {
//       for( let note of user.inbox ) {
//         if(note.unread) {
//           if(user.inbox.length > ibxLength) {
//             if (
//               ( !(navigator.userAgent.match(/Android/i) ||
//               navigator.userAgent.match(/iPhone/i) ||
//               navigator.userAgent.match(/iPad/i)) )
//               && Notification?.permission === "granted"
//             ) {
//               new Notification(note.title, {
//                 silent: false,
//                 body: note.detail,
//               });
//             }else{
//               const cue = note.reply ? '/UIAlert_short.mp3' : '/UIAlert_long.mp3';
//               const audioObj = new Audio(cue);
//               audioObj.addEventListener("canplay", event => {
//                 audioObj.play();
//               });
//             }
//             window.location.href='#neinbox';
//           }
//         }
//       }
//       ibxSet(user.inbox.length);
//     }
//   }, [user.inbox?.length]);
  
  // function bulkAction(action) {
  //   Meteor.call(action, (error)=>{
  //     error && console.log(error);
  //   });
  // }
  
  return(
    <div id="neeqlist" className='nesoRight'>
      <i className='texttitle subtext'>Equipment</i>
      {/*(user.inbox || []).length > 0 &&
        <div className='inboxCard'>
          <div><i></i>
            <div>
              <button onClick={()=>bulkAction('setReadAllInbox')}
              ><i className="far fa-circle-check darkgrayT fade gapR"></i>READ ALL
              </button>
              <button onClick={()=>bulkAction('removeAllInbox')}
              ><i className="fas fa-trash-can darkgrayT fade gapR"></i>DELETE ALL
              </button>
            </div>
          </div>
        </div>
      */}
      <div className='inboxFeed thinScroll'>
        {/*!(user.inbox || []).length &&
          <p className='centreText foottext'>No Messages <i className="fas fa-inbox"></i></p>
        */}
        {/*(user.inbox || []).toReversed().map( (entry)=> (
          <NotifyCardWrap 
            key={entry.notifyKey} 
            entry={entry}
            unice={unice} 
          />
        ))*/}
      </div>
    </div>
  );
};