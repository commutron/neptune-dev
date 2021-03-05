import React from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';

import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
// import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';
import TagsModule from '/client/components/bigUi/TagsModule';
import NotesModule from '/client/components/bigUi/NotesModule';

import VariantLive from '/client/components/forms/VariantLive';


const VariantPanel = ({ 
  variantData, widgetData, 
  groupData, batchRelated, 
  app, user
})=> {
  
  const v = variantData;
  const w = widgetData;
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});

  const vAssmbl = v.assembly.sort((p1, p2)=> {
                  if (p1.component < p2.component) { return -1 }
                  if (p1.component > p2.component) { return 1 }
                  return 0;
                });
  
  function removeComp(compPN) {
    const check = confirm('Are you sure you want to remove this ' + Pref.comp + '?');
    if(!check) {
      null;
    }else{
      Meteor.call('pullCompV', v._id, compPN, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  function downloadComp() {
    Meteor.call('componentExport', w._id, v._id, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        const name = w.widget + "_" + v.variant;
        const outputLines = reply.join('\n');
        const outputComma = reply.toString();
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputLines}`}
          download={name + ".txt"}>Download seperated by new lines</a>
          , {autoClose: false, closeOnClick: false}
        );
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputComma}`}
          download={name + ".csv"}>Download seperated by commas</a>
          , {autoClose: false, closeOnClick: false}
        );
      }
    });
  }
  
  return(
    <div className='space'>
      <div className='wide comfort'>
        
        <TagsModule
          action='variant'
          id={v._id}
          tags={v.tags}
          vKey={v.versionKey}
          tagOps={app.tagOption} />
          
        <div className='middle'>
          <VariantLive
            vId={v._id}
            vKey={v.versionKey}
            vState={v.live}
            noText={false}
            primeTopRight={false} />
        </div>
        
      </div>

      <hr className='vmargin' />
      
      <div className='containerE'/*oneTwoThreeContainer'*/>
        <div className='oneEcontent' /*'oneThirdContent'*/>

          <p>
            <a 
              className='clean wordBr' 
              href={v.instruct} 
              target='_blank'
            >{v.instruct}</a>
          </p>
              
          <p className='numFont'>default units: {v.runUnits}</p>
          
          <NotesModule
            sourceId={v._id}
            noteObj={v.notes}
            editMethod='setVariantNote'
            cal={calFunc} />
            
        </div>
        
        <div className='threeEcontent' /*twoThirdsContent'*/>
            
          
          <h3>{Pref.comp}s: {v.assembly.length}</h3>
          <dl>
            {vAssmbl.map((entry, index)=>{
              return(
                <dt key={index} className='letterSpaced'>
                  {entry.component}
                  <button
                    className='miniAction redT'
                    onClick={()=>removeComp(entry.component)}
                    disabled={!Roles.userIsInRole(Meteor.userId(), 'remove')}>
                  <i className='fas fa-times fa-fw'></i></button>
                </dt>
            )})}
          </dl>
          <br />
          <button
            className='transparent'
            title='Download Parts List'
            onClick={()=>downloadComp()}>
            <label className='navIcon actionIconWrap'>
              <i className='fas fa-download fa-fw'></i>
              <span className='actionIconText blackT'>Download</span>
            </label>
          </button>
          
        </div>
          
      </div>

      <CreateTag
        when={v.createdAt}
        who={v.createdWho}
        whenNew={v.updatedAt}
        whoNew={v.updatedWho}
        dbKey={v.versionKey} />
    </div>
  );
};

export default VariantPanel;