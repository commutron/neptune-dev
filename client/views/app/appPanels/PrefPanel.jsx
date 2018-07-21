import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import SetPin from '/client/components/forms/SetPin.jsx';
import {OptionAdd} from '/client/components/forms/AppSettings';
import {FinishTrack} from '/client/components/forms/AppSettings';
import {SetScale} from '/client/components/forms/AppSettings';
import {MethodOptionAdd} from '/client/components/forms/AppSettings';
import {OverrideLastestSerial} from '/client/components/forms/AppSettings';

export default class PrefPanel extends Component {
  
  ncRemove(name) {
    Bert.alert(Alert.wait);
    Meteor.call('removeNCOption', name, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  
  ncRemoveA(key, defect) {
    Bert.alert(Alert.wait);
    Meteor.call('removePrimaryNCOption', key, defect, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  ncDormantA(key, live) {
    const make = !live;
    Meteor.call('dormantPrimaryNCOption', key, make, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  
  ncRemoveB(key, defect) {
    Bert.alert(Alert.wait);
    Meteor.call('removeSecondaryNCOption', key, defect, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  ncDormantB(key, live) {
    const make = !live;
    Meteor.call('dormantSecondaryNCOption', key, make, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }
  
  ancRemove(name) {
    Bert.alert(Alert.wait);
    Meteor.call('removeAncOption', name, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.inUse);
      }
    });
  }

  render() {
    
    const dt = this.props.app;
    const auth = !Roles.userIsInRole(Meteor.userId(), 'admin');
    let trackOptions = dt.trackOption;  
      trackOptions.sort((t1, t2)=> {
        if (t1.step < t2.step) { return -1 }
        if (t1.step > t2.step) { return 1 }
        return 0;
      });

    return (
      <div className='section cap invert rowWrap'>
        <div className='wide clean'>
          <p>
            <i className='fas fa-exclamation-circle'></i>
            <i> Entries are case sensitive, smt =/= SMT.</i>
            <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
          </p>
          <br />
        </div>
        <fieldset disabled={auth}>
          <div className='space breathe'>
  
            <h2>{Pref.trackProcess} Steps</h2>
            <i>Options for tracked and controlled steps</i>
            <OptionAdd action='track' title='step' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <ul>
              {trackOptions.map( (entry, index)=>{
                return ( <li key={index}>{entry.step} - {entry.type}</li> );
              })}
            </ul>
            
            <hr />
  
            <h2>Final {Pref.trackProcess} step</h2>
            <i>the step that marks a {Pref.item} as finished</i>
            <FinishTrack last={dt.lastTrack} />
          
          </div>
        </fieldset>    
        
        <fieldset disabled={auth}>
          <div className='space breathe'>
  
            <h2>{Pref.counter} gates</h2>
            <i>Options for counters</i>
            <OptionAdd action='count' title='gate' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <ul>
              {dt.countOption && dt.countOption.map( (entry, index)=>{
                return ( <li key={index}>{entry.gate} - {entry.type}</li> );
              })}
            </ul>
          
          </div>
        </fieldset> 
        
        <fieldset disabled={auth}>
          <div className='space breathe'>
  
            <h2>Legacy {Pref.nonCon} Types</h2>
            <i>Options for types of legacy {Pref.nonCon}s.</i>
            <OptionAdd action='nc' title='defect' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <ol>
              {dt.nonConOption.map( (entry, index)=>{
                  return( 
                    <li key={index}>
                      <i>{entry}</i>
                      <button 
                        className='miniAction redT'
                        onClick={()=>this.ncRemove(entry)}
                      ><i className='fas fa-times fa-fw'></i></button>
                    </li>
              )})}
            </ol>
            
            <hr />
            
            <SetScale curScale={dt.ncScale || null} />
            
            <hr />
            
            <h2>Missing Type</h2>
            <i>Type of {Pref.nonCon} that can be converted into a shortfall</i>
            <OptionAdd action='miss' title='type' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <i><em>currently set to: </em>{dt.missingType || ''}</i>
            
            <hr />
            
            <h2>{Pref.ancillary} Steps</h2>
            <i>Not strictly assembly but part of the total proccess. Not tracked</i>
            <OptionAdd action='anc' title='step' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <ul>
              {dt.ancillaryOption.map( (entry, index)=>{
                return( 
                  <li key={index}>
                    <i>{entry}</i>
                    <button 
                      className='miniAction redT'
                      onClick={()=>this.ancRemove(entry)}
                    ><i className='fas fa-times fa-fw'></i></button>
                  </li>
              )})}
            </ul>
          
          </div>
        </fieldset>
        
        <fieldset disabled={true}>
          <div className='space breathe'>
  
            <h2>Primary {Pref.nonCon} Types</h2>
            <p>Options for types of Primary {Pref.nonCon}s</p>
            <i>a new smarter, keyed collection for serialized batches</i>
            <OptionAdd action='ncA' title='defect' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <ol>
              {dt.nonConOptionA && dt.nonConOptionA.map( (entry)=>{
                  return( 
                    <li key={entry.key}>
                      <i className={entry.live ? '' : 'fade'}>{entry.defect}</i>
                      <button 
                        className='miniAction redT'
                        onClick={()=>this.ncRemoveA(entry.key, entry.defect)}
                      ><i className='fas fa-times fa-fw'></i></button>
                      <button 
                        className='miniAction redT'
                        onClick={()=>this.ncDormantA(entry.key, entry.live)}
                      ><i className='fas fa-power-off fa-fw'></i></button>
                    </li>
              )})}
            </ol>
          </div>
        </fieldset>
        
        <fieldset disabled={auth}>
          <div className='space breathe'>
  
            <h2>Secondary {Pref.nonCon} Types</h2>
            <p>Options for types of Secondary {Pref.nonCon}s</p>
            <i>a new smarter, keyed collection for NON serialized batches</i>
            <OptionAdd action='ncB' title='defect' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <ol>
              {dt.nonConOptionB && dt.nonConOptionB.map( (entry)=>{
                  return( 
                    <li key={entry.key}>
                      <i className={entry.live ? '' : 'fade'}>{entry.defect}</i>
                      <button 
                        className='miniAction redT'
                        onClick={()=>this.ncRemoveB(entry.key, entry.defect)}
                      ><i className='fas fa-times fa-fw'></i></button>
                      <button 
                        className='miniAction redT'
                        onClick={()=>this.ncDormantB(entry.key, entry.live)}
                      ><i className='fas fa-power-off fa-fw'></i></button>
                    </li>
              )})}
            </ol>
          </div>
        </fieldset>
        
        <fieldset disabled={auth}>
          <div className='space breathe'>
            
            <h2>Smarter {Pref.method} options:</h2>
            <i>available methods for first-off form</i>
            <MethodOptionAdd existOps={dt.toolOption} trackedSteps={trackOptions} />
            
            <ul>
              {dt.toolOption.map( (entry, index)=>{
                if(typeof entry === 'object') {
                  return(
                    <li key={index}>
                      <dl>
                        <dt>{entry.title}</dt>
                        {entry.forSteps.map( (ntry, ndx)=>{
                          let nice = trackOptions.find( x => x.key === ntry ).step;
                          return( <dd key={ndx}>{nice}</dd> );
                        })}
                      </dl>
                    </li>
                  );
                }else{
                  null;
                }
              })}
            </ul>
            
            
          </div>
        </fieldset>    
        <fieldset disabled={auth}>
          <div className='space breathe'>
          
            <h2>Override Last Serials</h2>
            <OverrideLastestSerial
              dfNine={dt.latestSerial.nineDigit}
              dfTen={dt.latestSerial.tenDigit} />
          
            <hr />
            
            <h2>{Pref.tag} options:</h2>
            <i>available reusable {Pref.tag}s</i>
            <OptionAdd action='tag' title={Pref.tag} rndmKey={Math.random().toString(36).substr(2, 5)} />
              <ul>
                {!dt.tagOption ? null :
                  dt.tagOption.map( (entry, index)=>{
                    return ( <li key={index}><i>{entry}</i></li> );
                })}
              </ul>
              
          </div>
  
          <br />
        </fieldset>
          
        <fieldset disabled={auth}>
          <div className='space breathe'>
            
            <h2>{Pref.instruct} Root Address</h2>
            <i>The root address for embeded work instructions</i>
            <OptionAdd action='wi' title='address' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <p>current: <i className='clean'>{dt.instruct}</i></p>
            
            <h2>{Pref.helpDocs} Address</h2>
            <i>The address for Neptune documentation</i>
            <OptionAdd action='help' title='address' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <p>current: <i className='clean'>{!dt.helpDocs ? null : dt.helpDocs}</i></p>
            
            <h2>{Pref.timeClock} Address</h2>
            <i>For a 3rd party, employee time tracker</i>
            <OptionAdd action='time' title='address' rndmKey={Math.random().toString(36).substr(2, 5)} />
            <p>current: <i className='clean'>{dt.timeClock}</i></p>
  
          </div>
  
          <br />
        </fieldset>
        
        <fieldset disabled={auth}>
          <div className='space breathe'>
            <h2>Set or Change PIN</h2>
            <SetPin />
          </div>
        </fieldset>
      </div>
    );
  }
}