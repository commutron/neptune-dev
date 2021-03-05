import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import UserNice from '/client/components/smallUi/UserNice.jsx';

import ActionLink from '/client/components/tinyUi/ActionLink.jsx';

import { min2hr } from '/client/utility/Convert.js';

import NotesModule from '/client/components/bigUi/NotesModule';


const RapidExtendCard = ({ 
  batchData, widgetData, urlString,
  rapid, cal
})=> {
  
  function handleRemove(idVal) {
    const check = window.confirm('Permanently Delete Extension??');
    
    if(check) {
      Meteor.call('deleteExtendRapid', idVal, (error, re)=>{
        error && console.log(error);
        re ? toast.success('success') : toast.error('unsuccessful');
      });
    }
  }
  
  
  return(
    <div className='wAuto'>
      <p>
        
      </p>
          
          
          
          
          
          
      <div className='comfort'>
        
        <div className='centreRow'>
          
          <span>
            {rapid.live ?
              <n-fa1><i className='fas fa-bolt fa-2x darkOrangeT'></i></n-fa1>
              :
              <n-fa2><i className='fas fa-power-off fa-2x'></i></n-fa2>
            }
          </span>
          <span className='big gapR'>{rapid.rapid}</span>
          <span className='medBig gap'>{rapid.issueOrder}</span>
        </div>
      
      
        <div className='centreRow'>
          
          
          <ActionLink
            address={'/print/generallabel/' + 
                      rapid.rapid + urlString +
                      '&sales=' + 'Issue: ' + rapid.issueOrder +
                      '&quant=' + rapid.quantity }
            title='Print Label'
            icon='fa-print'
            color='blackT' />
          
          
          
            <button
              onClick={()=>handleRemove(rapid._id)}
              className='action clearRed'
              disabled={!rapid.live}
            ><i className="fas fa-trash fa-lg gap redT"></i> Delete Extension</button>


        </div>
        
        
      </div>
      
      <div className='comfort'>
          
         
        <div className='readlines'>  
          <p>Created: {cal(rapid.createdAt)} by <UserNice id={rapid.createdWho} /></p>
          
          <p>Delivery Goal: {cal(rapid.deliverAt)}</p>
          
          {rapid.closedWho &&
            <p>Closed {cal(rapid.closedAt)} by <UserNice id={rapid.closedWho} /></p>}
          
          <p>Quantity: <n-num>{rapid.unlimited ? 'Unlimited' : rapid.quantity}</n-num></p>
            
          <p>Extra Minutes: <n-num>{rapid.timeBudget}</n-num></p>
          
          <p className='wordBr'>Override Instruction: {rapid.instruct}</p>  
        </div>
        
        <NotesModule
          sourceId={rapid._id}
          noteObj={rapid.notes}
          editMethod='setRapidNote'
          cal={cal} /> 
            
      </div>

      <div>    
          
        <dl>
          <dt>Cascade</dt>
          {rapid.cascade.map( (e, ix)=>(
            <dd key={'cs'+ix}>{e.gate}</dd>
          ))}
        </dl>
        
        <dl>
          <dt>Whitewater</dt>
          {rapid.whitewater.map( (e, ix)=>(
            <dd key={'ww'+ix}>{e.step}</dd>
          ))}
        </dl>
        
        <dl>
          <dt>Auto NonCons</dt>
          {rapid.autoNC.map( (e, ix)=>(
            <dd key={'nc'+ix}>{e.type} - {e.ref}</dd>
          ))}
        </dl>
        
        <dl>
          <dt>Auto Shortfalls</dt>
          {rapid.autoSH.map( (e, ix)=>(
            <dd key={'sh'+ix}>{e.part} - {e.refs}</dd>
          ))}
        </dl>
        
        
      </div>
    
    
    </div>
  );
};

export default RapidExtendCard;