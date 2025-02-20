import React from 'react';

import WikiFrame from './WikiFrame';

const WikiOps = ({ root, anchor, full })=> {
  
  const page = Session.equals('nowInstruct', '' ) ||
                  Session.equals('nowInstruct', undefined) || 
                  Session.equals('nowInstruct', 'home') || 
                  Session.equals('nowInstruct', 'none' ) ?
                    root : Session.get('nowInstruct');
  
  const address = page.slice(0,4) === 'http' ? page : root + page;
  
  const noA = !Meteor.user().scrollInstruct || !anchor || anchor === "";
  const goString = noA ? address : `${address}?m=${anchor}#${anchor}`;
  // append to link for auto-open module ==> "?m=[MODULE_SLUG]#[MODULE_SLUG]"
  return(
    <WikiFrame go={goString} full={full} anchor={anchor} />
  );
};

export default WikiOps;