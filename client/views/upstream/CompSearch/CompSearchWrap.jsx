import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const CompSearchWrap = ({ plCache, user, app })=> {
  
  const [ bChk, setB ] = useState(true);
  const [ uChk, setU ] = useState(false);
  const [ thing, setThing ] = useState("");
  const [ results, setResults ] = useState([]);
  
  const [ autocompState, autocompSet ] = useState( [] );
  
  useEffect( ()=>{
    if(thing.length >= 4) {
      const opList = plCache.filter( x => x.startsWith( thing ) );
      autocompSet( opList );
    }
    else{
      autocompSet( [] );
    }
  }, [thing]);
  
  function thisThing(e) {
    const num = this.pnFind.value.trim().toLowerCase();
    setThing( num );
  }
  
  function lookup(e) {
    e.preventDefault();
    if(thing !== false) {
      Meteor.call('componentFind', thing, bChk, uChk, (error, reply)=>{
        if(error)
          return error;
        if(reply.length > 0) {
          const replieS = reply.sort((r1, r2)=> {
              if (r1.grp === r2.grp && r1.wdgt < r2.wdgt) { return -1 }
              if (r1.grp === r2.grp && r1.wdgt > r2.wdgt) { return 1 }
              if (r1.grp < r2.grp) { return -1 }
              if (r1.grp > r2.grp) { return 1 }
              return 0;
            });
          setResults( replieS );
        }else{
          setResults( false );
        }
      });
    }else{null}
  }
  
  function dataExport() {
    toast('request sent, please wait for a download link');
    Meteor.call('componentExportAll', (error, reply)=>{
      if(error)
        return error;
      if(reply) {
        const outputLines = reply.join('\n');
        const outputComma = reply.toString();
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputLines}`}
          download="all_starfish_parts.txt">Download seperated by new lines</a>
          , {autoClose: false, closeOnClick: false}
        );
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputComma}`}
          download="all_starfish_parts.csv">Download seperated by commas</a>
          , {autoClose: false, closeOnClick: false}
        );
      }
    });
  }
  
  function requestRefresh(e) {
    this.cachePLupdate.disabled = true;
    toast('request sent, this will take time');
    Meteor.call('partslistCacheUpdate', (error)=>{
      if(error)
        return error;
    });
  }

  let batchCount = 0;
  results && results.forEach( y => batchCount += y.btchs.length );
  
  return(
    <div className='simpleContent starfishAccents'>
    
      <div className='wide rowWrapR lightTheme'>
        <div>
          <button
            type='button'
            title='Download All Parts'
            className='taskLink'
            onClick={(e)=>dataExport(e)}>
          <i className='fas fa-download'></i>
          </button>
        </div>
        <div>
          <button
            id='cachePLupdate'
            type='button'
            title='Rebuild Autocomplete'
            onClick={(e)=>requestRefresh(e)}
            className='taskLink'
            disabled={!Roles.userIsInRole(Meteor.userId(), 'admin')}>
          <i className='fas fa-cogs'></i>
          </button>
        </div>
      </div>
      
      <div className='centre space'>
        <form
          className='inlineForm'
          onSubmit={(e)=>lookup(e)}>
          <label className='variableInput bigger'>
            <input
              type='search'
              id='pnFind'
              list='plList'
              minLength='4'
              className='variableInput bigger dbbleWide up'
              disabled={false}
              onChange={(e)=>thisThing(e)}
              autoFocus={true}
              autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
              // ^^^ workaround for persistent bug in desktop Firefox ^^^
              required
            />
          </label>
          <datalist id='plList'>
            {autocompState.map( (entry, index)=>{
              return( 
                <option key={index+'Y'+entry}>{entry.toUpperCase()}</option>
            )})}
          </datalist>
          <label className='variableInput bigger'>
            <button
              type='submit'
              id='pnFindButton'
              title='search button'
              className='smallAction'
            ><i className='bigger fas fa-search fa-fw'></i></button>
          </label>
        </form>
        
        <div className='balance gapsC vmarginquarter'>
          <span className='beside'>
            <input
              type='checkbox'
              id='bc'
              defaultChecked={bChk}
              onChange={()=>setB(!bChk)}
            />
            <label htmlFor='bc'>{Pref.xBatch} Info</label>
          </span>
          <span className='beside'>
            <input
              type='checkbox'
              id='uc'
              defaultChecked={uChk}
              onChange={()=>setU(!uChk)}
            />
            <label htmlFor='uc'>{Pref.unit}s Quantity</label>
          </span>
        </div>
      </div>
      
      <div className='centre space'>
        <div className='balance min400 cap'>
          <i>{Pref.widget} {Pref.variants}: {results ? results.length : 0}</i>
          <i>{Pref.xBatchs}: {batchCount}</i>
        </div>
      </div>
      
      <hr />
      
      {!results ?
        <div className='space'>
          <p className='centreText'><em>Nothing Found</em></p>
        </div>
      :
        <div className='centre space'>
          <table className='wide searchResult'>
            {results.map((entry, index)=>{
              const mtch = entry.btchs.length > 0 ? entry.btchs.length : 1;
              return(
                <tbody key={index}>
                  <tr className='cap'>
                    <td rowSpan={mtch}>
                      {entry.grp} {entry.wdgt} v.{entry.vrnt} {entry.dsc}
                    </td>
                    <td>
                    {entry.btchs.map((b, ix)=>{
                      return(
                        <div key={b.btch + ix} className='mockTableRow'>
                          <div className='mockTableCell'>{b.btch}</div>
                          {b.cnt > 0 ?
                            <div className='mockTableCell'>{b.cnt} boards</div>
                          :null}
                        </div>
                    )})}
                    </td>
                  </tr>
                </tbody>
            )})}
          </table>
        </div>
      }
    </div>
  );
};

export default CompSearchWrap;