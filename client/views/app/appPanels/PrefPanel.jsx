import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import {OptionAdd} from '/client/components/forms/AppSettings';
import {FinishTrack} from '/client/components/forms/AppSettings';

export default class PrefPanel extends Component {

  render() {
    
    const dt = this.props.app;
    const auth = !Roles.userIsInRole(Meteor.userId(), 'admin');
    //let trackOptions = dt.trackOption.sort((t1, t2) => {return t1.step > t2.step});
    let trackOptions = dt.trackOption;  
      trackOptions.sort((t1, t2)=> {
        if (t1.step < t2.step) { return -1 }
        if (t1.step > t2.step) { return 1 }
        return 0;
      });

    return (
      <SlideDownWrap>
      <div className='card cap invert'>
        <fieldset disabled={auth}>
        <div className='space breathe'>
          <h1>app preferences for : <i>{dt.org}</i></h1>
          <hr />

          <h2>{Pref.trackProcess} Steps</h2>
          <i>Options for tracked and controlled steps</i>
          <OptionAdd action='track' title='step' />
          <ul>
            {trackOptions.map( (entry, index)=>{
              return ( <li key={index}>{entry.step} - {entry.type}</li> );
            })}
          </ul>
          
          <hr />

          <h2>Final {Pref.trackProcess} step</h2>
          <i>the step that marks a {Pref.item} as finished</i>
          <FinishTrack last={dt.lastTrack} />
          
          <hr />

          <h2>{Pref.nonCon} Types</h2>
          <i>Options for types of {Pref.nonCon}s</i>
          <OptionAdd action='nc' title='defect' />
          <ul>
            {dt.nonConOption.map( (entry, index)=>{
                return ( <li key={index}><i>{entry}</i></li> );
              })}
          </ul>
          
          <hr />

          <h2>{Pref.ancillary} Steps</h2>
          <i>Not strictly assembly but part of the total proccess. Not tracked</i>
          <OptionAdd action='anc' title='step' />
          <ul>
            {dt.ancillaryOption.map( (entry, index)=>{
              return ( <li key={index}><i>{entry}</i></li> );
            })}
          </ul>
          
          <hr />
          
          <h2>{Pref.method} options:</h2>
          <i>available methods for first-off form</i>
          <OptionAdd action='tool' title='tool' />
            <ul>
              {dt.toolOption.map( (entry, index)=>{
                return ( <li key={index}><i>{entry}</i></li> );
              })}
            </ul>
          
          <hr />
            
          <h2>{Pref.instruct} Root Address</h2>
          <i>The root adress for embeded work instructions</i>
          <OptionAdd action='wi' title='address' />
          <p>current: <i className='clean'>{dt.instruct}</i></p>
            
          <h2>{Pref.timeClock} Address</h2>
          <i>For a 3rd party, employee time tracker</i>
          <OptionAdd action='time' title='address' />
          <p>current: <i className='clean'>{dt.timeClock}</i></p>

        </div>

        <br />
      </fieldset>
      </div>
      </SlideDownWrap>
    );
  }
}