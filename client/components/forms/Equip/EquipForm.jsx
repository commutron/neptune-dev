import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment-timezone';

import ModelMedium from '/client/layouts/Models/ModelMedium';
import { cleanURL } from '/client/utility/Convert';

const EquipFormWrapper = ({ 
  id, name, alias, model, mfserial, mfyear, mfwrnty, brKey, wiki, lib, rootURL, brancheS,
  noText, primeTopRight, lgIcon,
  lockOut
})=> {
  const bttn = id ? `edit ${Pref.equip}` : `new ${Pref.equip}`;
  const otitle = id ? 'edit ' + Pref.equip : 'create new ' + Pref.equip;
  
  const access = id ? Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']) :
                        Roles.userIsInRole(Meteor.userId(), ['equipSuper','create']);
  const aT = !access ? Pref.norole : '';
  const lT = lockOut ? `${Pref.equip} is offline` : '';
  const title = access && !lockOut ? otitle : `${aT}\n${lT}`;
  
  return(
    <ModelMedium
      button={bttn}
      title={title}
      color='midnightblueT'
      icon='fa-robot'
      lock={!access || lockOut}
      noText={noText}
      primeTopRight={primeTopRight}
      lgIcon={lgIcon}>
      <EquipForm 
        id={id}
        name={name}
        alias={alias}
        model={model}
        mfserial={mfserial}
        mfyear={mfyear}
        mfwrnty={mfwrnty}
        brKey={brKey}
        wiki={wiki}
        lib={lib}
        rootURL={rootURL}
        brancheS={brancheS}
      />
    </ModelMedium>
  );
};

export default EquipFormWrapper;

const EquipForm = ({ 
  id, name, alias, model, mfserial, mfyear, mfwrnty,
  brKey, wiki, lib, rootURL, brancheS, selfclose
})=> {

  function saveEquipment(e) {
    e.preventDefault();
    const equipId = id;
    const eqname = this.eName.value.trim();
    const eqalias = this.eAlias.value.trim().toLowerCase();
    
    const eqmodel = this.eModel.value.trim();
    const eqserial = this.eMfSerial.value.trim();
    const eqmfyear = this.eMfYear.value.trim();
    const eqmfwrnty = this.eMfWrnty.value.trim();
    
    const eqBrKey = this.eBrKey.value;
    
    const wURL = this.eWiki.value.trim();
    const eqwiki = cleanURL(wURL, rootURL);
    
    const lURL = this.reWiki.value.trim();
    const eqlib = cleanURL(lURL, rootURL);
    
    if(equipId) {
       Meteor.call('editEquipment', 
       equipId, eqname, eqalias, eqmodel, eqserial, eqmfyear, eqmfwrnty, eqBrKey, eqwiki, eqlib,
      (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/equipment/' + eqalias);
          selfclose();
        }else{
          toast.warning('Duplicate Name');
        }
      });
    }else{
      Meteor.call('createEquipment', 
      eqname, eqalias, eqmodel, eqserial, eqmfyear, eqmfwrnty, eqBrKey, eqwiki, eqlib,
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/equipment/' + eqalias);
          selfclose();
        }else{
          toast.warning('Duplicate Name');
        }
      });
    }
  }
    
  const orName = name ? name : '';
  const orAlias = alias ? alias : '';
  
  const orModel = model || '';
  const orMfSerial = mfserial || '';
  const orMfYear = mfyear || '';
  const orMfWrnty = mfwrnty ? moment(mfwrnty).tz('UTC').format('YYYY-MM-DD') : '';
  
  const orBrKey = brKey ? brKey : false;
  const orWiki = wiki ? wiki : '';
  const orLib = lib ? lib : '';

  return(
    <form id='newEquip' className='fitWide' onSubmit={(e)=>saveEquipment(e)}>
      <div className='balance gapsC'>
        <EqInput 
          id='eName'
          label='Full Name' 
          dfVal={orName}
          place='ie. Heller 1707 Reflow Oven'
          pattern='[A-Za-z0-9 _\-]*'
          max={Pref.groupMax}
          req={true}
          af={true}
          cls='tppleWide'
        />
      </div>
      <div className='balance gapsC'>
        <EqInput 
          id='eAlias'
          label='Alias / Common' 
          dfVal={orAlias}
          place='ie. Reflow'
          pattern='[A-Za-z0-9 _\-]*'
          max={Pref.aliasMax}
          req={true}
        />
        <p>
          <label htmlFor='eBrKey'>{Pref.branch}<br />
            <select id='eBrKey' defaultValue={orBrKey} required>
              <option value={false}>Unassigned</option>
              {brancheS.map( (br, index)=>(
                <option key={index} value={br.brKey} className='cap'>{br.branch}</option>
              ))}
            </select>
          </label>
        </p>
      </div>
      <div className='balance gapsC'>
        <EqInput 
          id='eModel'
          label='Model'
          dfVal={orModel}
          place='ie. 1707 MKIII'
        />
        <EqInput 
          id='eMfSerial'
          label='Serial Number'
          place='ie. C9FN-K52J-7976-F352'
          dfVal={orMfSerial}
        />
      </div>
      <div className='balance gapsC'>
        <EqInput 
          id='eMfYear'
          label='Manufacture Year' 
          dfVal={orMfYear}
          place='ie. 2014'
          pattern='[0-9]*'
          max={4}
        />
        <p>
          <label htmlFor='eMfWrnty'>Warranty Expiration<br />
            <input
              type='date'
              id='eMfWrnty'
              defaultValue={orMfWrnty}
            />
          </label>
        </p>
      </div>
      <div className='balance gapsC'>
        <EqInput 
          id='eWiki'
          label={`${Pref.premaintain} ${Pref.instruct}`}
          dfVal={orWiki}
          place='http://192.168.1.68/pisces'
          cls='tppleWide'
        />
      </div>
      <div className='balance gapsC'>
        <EqInput 
          id='reWiki'
          label={`${Pref.equip} Repair Documents`}
          dfVal={orLib}
          place='http://192.168.1.68/pisces'
          cls='tppleWide'
        />
      </div>
      <p className='centre'>
        <button
          type='submit'
          id='eqSave'
          className='action nSolid'
          >Save
        </button>
      </p>
    </form>
  );
};

const EqInput = ({ id, label, dfVal, place, pattern, max, req, af, cls })=> (
  <p>
    <label htmlFor={id} className={`${cls} cap`}>{label}<br />
      <input
        type='text'
        id={id}
        defaultValue={dfVal}
        placeholder={place || ''}
        className={cls || ''}
        pattern={pattern || null}
        maxLength={max}
        required={req || false} 
        autoFocus={af || false} 
      />
    </label>
  </p>
);