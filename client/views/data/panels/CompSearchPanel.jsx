import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import { ToastContainer, toast } from 'react-toastify';

export default class CompSearchPanel extends Component	{
  
  constructor() {
    super();
    this.state = {
      bChk: true,
      uChk: false,
      thing: false,
      results: []
    };
  }
  
  thisThing(value) {
    this.setState({ results : [] });
    const num = value.trim().toLowerCase();
    this.setState({ thing: num });
  }
  
  lookup(e) {
    e.preventDefault();
    if(this.state.thing !== false) {
      const thing = this.state.thing;
      const bChk = this.state.bChk;
      const uChk = this.state.uChk;
      Meteor.call('componentFind', thing, bChk, uChk, (error, reply)=>{
        if(error)
          return error;
        if(reply.length > 0) {
          this.setState({ results: reply });
        }else{
          this.setState({ results: false });
        }
      });
    }else{null}
  }
  
  dataExport() {
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

  render() {

    let r = this.state.results;
    let w = 0;
    r && r.length > 0 ? r.forEach( x => x.vrsns.forEach( y => w += y.btchs.length ) ) : null;

    return (
      <AnimateWrap type='cardTrans'>
        <div key={1} className='simpleContainer'>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            newestOnTop />
          <div className='tenHeader invert'>
            <div className='topBorder'></div>
            <HomeIcon />
            <div className='frontCenterTitle invert'>Parts Search</div>
            <div className='auxRight invert'>
              <button
                type='button'
                title='Download All Parts'
                onClick={(e)=>this.dataExport(e)}>
              <i className='fas fa-download primeRightIcon'></i>
              </button>
            </div>
            <TideFollow invertColor={true} />
          </div>
        
        <div className='simpleContent invert starfishAccents vspace'>
          <div className='centre space'>
            <form
              className='inlineForm'
              onSubmit={(e)=>this.lookup(e)}>
              <label>
                <input
                  type='search'
                  id='pnFind'
                  className='up'
                  ref={(i)=>this.pn = i}
                  onChange={()=> this.thisThing(this.pn.value)}
                  autoFocus
                />
              </label>
              <label>
                <button
                  type='submit'
                  id='pnFindButton'
                  aria-label='search button'
                  className='smallAction clear'
                ><i className='fas fa-search'></i></button>
              </label>
            </form>
            <div className='balance'>
              <br />
              <span>
                <input
                  type='checkbox'
                  id='bc'
                  defaultChecked={true}
                  onChange={()=>this.setState({bChk: !this.state.bChk})}
                />
                <label htmlFor='bc'>{Pref.batch} Info</label>
              </span>
              <span>
                <input
                  type='checkbox'
                  id='uc'
                  defaultChecked={false}
                  onChange={()=>this.setState({uChk: !this.state.uChk})}
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
      </AnimateWrap>
    );
  }
}