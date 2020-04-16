import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import { ToastContainer, toast } from 'react-toastify';

    
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
          setResults( reply );
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

  let r = results;
  let w = 0;
  r && r.length > 0 ? r.forEach( x => x.vrsns.forEach( y => w += y.btchs.length ) ) : null;

  return(
    <div key={1} className='simpleContainer'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop />
      <div className='tenHeader invert'>
        <div className='topBorder'></div>
        <HomeIcon />
        <div className='auxLeft invert'>
          <button
            type='button'
            title='Download All Parts'
            onClick={(e)=>dataExport(e)}>
          <i className='fas fa-download primeRightIcon'></i>
          </button>
        </div>
        <div className='frontCenterTitle invert'>Parts Search</div>
        <div className='auxRight invert'>
          <button
            id='cachePLupdate'
            type='button'
            title='Rebuild Autocomplete'
            onClick={(e)=>requestRefresh(e)}
            disabled={!Roles.userIsInRole(Meteor.userId(), 'admin')}>
          <i className='fas fa-cogs fa-fw primeRightIcon'></i>
          </button>
        </div>
        <TideFollow invertColor={true} />
      </div>
    
    <div className='simpleContent invert starfishAccents vspace'>
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
        
        
        
        
        <div className='balance'>
          <br />
          <span>
            <input
              type='checkbox'
              id='bc'
              defaultChecked={bChk}
              onChange={()=>setB(!bChk)}
            />
            <label htmlFor='bc'>{Pref.batch} Info</label>
          </span>
          <span>
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
          <i>{Pref.widget}s: {r ? r.length : 0}</i>
          <i>{Pref.batch}s: {w}</i>
        </div>
      </div>
      
      <hr />
      
      {!r ?
        <div className='space'>
          <p className='centreText'><em>Nothing Found</em></p>
        </div>
      :
        <div className='centre space'>
          <table className='wide searchResult'>
            {r.map((entry, index)=>{
              return(
                <tbody key={index}>
                  <tr className='cap'>
                    <td colSpan='2'>
                      {entry.grp} {entry.dsc}
                    </td>
                  </tr>
                  
                  {entry.vrsns.map((e)=>{
                    return(
                      <tr key={e.vKey}>
                        <td className='up'>
                          {entry.wdgt}{e.ver}
                        </td>
                        <td>
                        {e.btchs.map((b)=>{
                          return(
                            <div key={b.btch + e.vKey} className='mockTableRow'>
                              <div className='mockTableCell'>{b.btch}</div>
                              {b.cnt > 0 ?
                                <div className='mockTableCell'>{b.cnt} boards</div>
                              :null}
                            </div>
                        )})}
                        </td>
                      </tr>
                  )})}
                </tbody>
            )})}
          </table>
        </div>
      }
    </div>
    </div>
  );
};

export default CompSearchWrap;