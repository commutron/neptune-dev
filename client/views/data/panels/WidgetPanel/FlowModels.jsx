import React, { useState, useEffect, Fragment } from 'react';

import FlowFormRoute from '/client/components/forms/Flow/FlowFormRoute';
import QuoteTaskTime from '/client/components/forms/Flow/QuoteTaskTime';

const FlowModels = ({ 
  widgetData, variantData, app,
  selectedFlow, clearOnClose,
  canEdt, canSls, isDebug
})=> {
  
  const [ imods, imodsSet ] = useState(new Set());
  
  useEffect( ()=> {
    if(variantData) { 
      const root = app.instruct || '';
      
      const urls = variantData.map( v => v.live && v.instruct );
      
      for(let u of urls) {
        const http = !u ? undefined :
                    u.slice(0,4) === 'http' ? u + ".json" : 
                    u.slice(0,1) === '/' ? root + u + ".json" :
                    root + '/' + u + ".json";
        if(http) {
          try {
            fetch(http, {})
            .catch( ()=> {
              null;
            })
            .then( (response)=> {
              if(response?.ok) { return response.json(); }
            })
            .then( (articles)=> {
              if(articles && articles.modules) { 
                let names = imods;
                articles.modules.map( m=> m.module ).forEach( a => names.add(a) );
                imodsSet(names);
              }
            });
          } catch(e) {
            console.error(e);
          }
        }
      }
    }
  }, []);
  
  return(
  	<Fragment>
      <FlowFormRoute
        id={widgetData._id}
        preFillKey={selectedFlow}
        existFlows={widgetData.flows}
        imods={[...imods].sort()}
        app={app}
        access={canEdt}
        clearOnClose={clearOnClose}
      />
      <QuoteTaskTime
        id={widgetData._id}
        flowKey={selectedFlow}
        existFlows={widgetData.flows}
        app={app}
        access={canSls}
        isDebug={isDebug}
        clearOnClose={clearOnClose}
      />
  	</Fragment>
  );
};

export default FlowModels;