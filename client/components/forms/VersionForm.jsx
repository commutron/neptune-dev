import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// requires
// widgetData={widgetData} end={a.lastTrack} rootWI={a.instruct}

export default class VersionForm extends Component	{

  constructor() {
    super();
    this.state = {
      instruct: '...'
   };
  }

//// This is not functioning. Gets blocked for security \\\\
  pullOver() {
    this.setState({instruct: document.getElementById('instruct').contentWindow.location.href});
  }

  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const wId = this.props.widgetData._id;
    
    const edit = this.props.version;
    const vKey = edit ? edit.versionKey : false;
    
    const version = this.rev.value.trim();
    const live = this.live ? this.live.checked : false;
    const wiki = this.wiki.value.trim().toLowerCase();
    const unit = this.unit.value.trim();
    
    if(edit) {
      Meteor.call('editVersion', wId, vKey, version, live, wiki, unit, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          Bert.alert(Alert.success);
        }else{
          Bert.alert(Alert.warning);
          this.go.disabled = false;
        }
      });
    }else{
      Meteor.call('addVersion', wId, version, wiki, unit, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          Bert.alert(Alert.success);
        }else{
          Bert.alert(Alert.warning);
          this.go.disabled = false;
        }
      });
    }
  }

  render() {
    
    const app = this.props.app;
    
    let e = this.props.version;
    let name = e ? 'edit' : 'new';
    let eV = e ? e.version : null;
    let eU = e ? e.units : null;
    let eL = e ? e.live : null;
    
    const w = this.props.widgetData;
    const instruct = w.versions.length > 0 ? w.versions[w.versions.length -1].wiki : app.instruct;

    return (
      <Model
        button={name + ' ' + Pref.version}
        title={name + ' ' + Pref.version}
        lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}>

      <div className='split'>

        <div className='half space edit'>
          <form onSubmit={this.save.bind(this)}>
            <p>
              <input
                type='text'
                id='widgetId'
                defaultValue={this.props.widgetData.widget}
                disabled={true} />
              <label htmlFor='widgetId'>{Pref.widget} ID</label>
            </p>
            <p>
              <input
                type='text'
                id='prodiption'
                defaultValue={this.props.widgetData.describe}
                disabled={true} />
              <label htmlFor='prodiption'>{Pref.widget} Description</label>
            </p>
            <p>
              <input
                type='text'
                ref={(i)=> this.rev = i}
                id='rv'
                defaultValue={eV}
                placeholder='1a'
                inputMode='numeric'
                required />
              <label htmlFor='rv'>Version</label>
            </p>
            <p>
              <input
                type='number'
                ref={(i)=> this.unit = i}
                id='cln'
                pattern='[0-999]*'
                maxLength='3'
                minLength='1'
                max='100'
                min='1'
                defaultValue={eU}
                placeholder='1-100'
                inputMode='numeric'
                required />
              <label htmlFor='cln'>{Pref.unit} Quantity</label>
            </p>
            <hr />
            <p>
              <input
                type='url'
                id='wikdress'
                ref={(i)=> this.wiki = i}
                defaultValue={instruct}
                placeholder='Full Address'
                required />{/*this.state.instruct*/}
              <label htmlFor='wikdress'>Work Instructions</label>
            </p>
            <br />
            {e ?
              <fieldset>
                <input
                  type='checkbox'
                  ref={(i)=> this.live = i}
                  defaultChecked={eL} />
                <label htmlFor='actv'>{Pref.live} {Pref.widget}</label>
              </fieldset>
            : null}
            <br />
            <button
              type='submit'
              className='action clear greenT'
              ref={(i) => this.go = i}
              disabled={false}>SAVE</button>
          </form>
        </div>

        <div className='half'>
          <iframe
            id='instructMini'
            src={instruct}
            height='600'
            width='100%' /><br />
          <button className='smallAction clear' onClick={this.pullOver} disabled>use this page</button>
          <i className='redT'>blocked for security</i>
        </div>

      </div>
    </Model>
    );
  }
}



export class VersionRemove extends Component	{
  
  remove(e) {
    e.preventDefault();
    const wId = this.props.widgetId;
    const vKey = this.props.versionKey;
    const confirm = this.confirm.value.trim();
    
    Meteor.call('deleteVersion', wId, vKey, confirm, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === 'inUse') {
        Bert.alert( Alert.inUse );
      }else if(reply) {
        Bert.alert( Alert.success );
      }else{
        Bert.alert( 'Rejected by Server', 'danger' );
      }
    });
  }
  
  render() {
    
    let user = !Roles.userIsInRole(Meteor.userId(), 'remove');
    
    return(
      <form className='inlineForm' onSubmit={this.remove.bind(this)}>
        <i className='noCopy'>enter: {this.props.lock} to confirm</i>
        <input 
          type='text' 
          className='noCopy' 
          ref={(i)=> this.confirm = i}
          disabled={user} 
          placeholder={this.props.lock} />
        <button
          type='submit'
          ref={(i)=> this.cut = i}
          className='smallAction clear redT'
          disabled={user}>delete</button>
      </form>
    );
  }
}