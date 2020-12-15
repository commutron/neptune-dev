import React from 'react';
import {mount} from 'react-mounter';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';

import Pref from '/client/global/pref.js';

import { PublicLayout } from './layouts/MainLayouts.jsx';
import { SplashLayout } from './layouts/MainLayouts.jsx';
import { CleanLayout } from './layouts/MainLayouts.jsx';
import { LabelLayout } from './layouts/MainLayouts.jsx';

import Login from './views/Login.jsx';
//import InitialSetup from './views/InitialSetup.jsx';

import ProdData from './views/production/ProdData.jsx';

import UpstreamData from './views/upstream/UpstreamData.jsx';
import OverviewData from './views/overview/OverviewData.jsx';
import DownstreamData from './views/downstream/DownstreamData.jsx';

import PeopleDataWrap from './views/people/PeopleDataWrap.jsx';
import UserDataWrap from './views/user/UserDataWrap.jsx';
import DataData from './views/data/DataData.jsx';
import AppData from './views/app/AppData.jsx';

import GeneralLabel from './views/paper/GeneralLabel.jsx';

import LandingWrap from './LandingWrap.jsx';

// Client Side Colllections
AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
VariantDB = new Mongo.Collection('variantdb');
BatchDB = new Mongo.Collection('batchdb');
XBatchDB = new Mongo.Collection('xbatchdb');

CacheDB = new Mongo.Collection('cachedb');
TraceDB = new Mongo.Collection('tracedb');


SubMngr = new SubsManager({
  // maximum number of cache subscriptions
  cacheLimit: 3,
  // expire after 5 minute, if it's not subscribed again
  expireIn: 5
});

FlowRouter.notFound = {
  action() {
    mount(PublicLayout, {
      content: (<p className='centreText'>Page Not Found</p>),
      title: '404'
    });
  }
};

const exposedRoutes = FlowRouter.group({
  subscriptions: function(params, queryParams) {
    this.register('routerSub', SubMngr.subscribe('loginData'));
  }
});

exposedRoutes.route('/login', {
  name: 'login',
  action() {
    mount(PublicLayout, {
       content: (<Login />),
       title: 'Sign In'
    });
  }
});
/*
exposedRoutes.route('/meta', {
  name: 'meta',
  action() {
    mount(SplashLayout, {
      content: (
        <div className='centreSpash'>
          <div>
            <p className='centre'>
              <img src='/titleLogo.svg' className='shadow noCopy' height='400' />
            </p>
            <div className='monoFont centreText'>
              <p>Neptune {Pref.neptuneVersion}</p>
              <p>Copyright (c) 2016-present Commutron Industries <a href='https://www.commutron.ca' target='_blank'>https://www.commutron.ca</a></p>
              <p>Author 2016-present Matthew Andreas <a href='https://github.com/mattandwhatnot' target='_blank'>https://github.com/mattandwhatnot</a></p>
              <p>All Rights Reserved, No Public License</p>
              <p>Source avaliable <a href='https://github.com/commutron/neptune-dev' target='_blank'>https://github.com/commutron/neptune-dev</a></p>
            </div>
          </div>
        </div>
      ),
      title: Pref.neptuneIs
    });
  }
});
*/

const privlegedRoutes = FlowRouter.group({
  triggersEnter: [
    ()=> {
      let route = FlowRouter.current();
      if(Meteor.loggingIn() || route.route.name === 'login') {
        null;
      }else if(!Meteor.userId()) {
        Session.set('redirectAfterLogin', route.path);
        FlowRouter.go('login');
      }else{
        Session.set('redirectAfterLogin', route.path);
      }
    }
  ],
  subscriptions: function(params, queryParams) {
    this.register('routerSubSelf', SubMngr.subscribe('selfData'));
    this.register('routerSubApp', SubMngr.subscribe('appData'));
  }
});

/*
exposedRoutes.route('/initialsetup', {
  name: 'initialsetup',
  action() {
    mount(PublicLayout, {
       content: (
        <div>
          <InitialSetup />
        </div>
      ),
      title: 'Initial App Setup'
    });
  }
});
*/
privlegedRoutes.route('/', {
  name: 'home',
  action() {
    mount(SplashLayout, {
       content: (<LandingWrap />),
       title: Pref.neptuneIs
    });
  }
});

privlegedRoutes.route('/app', {
  action() {
    mount(CleanLayout, {
       content: (<AppData />)
    });
  }
});

privlegedRoutes.route('/user', {
  action() {
    mount(CleanLayout, {
       content: (<UserDataWrap />)
    });
  }
});

privlegedRoutes.route('/production', {
  name: 'production',
  action() {
    mount(CleanLayout, {
      content: (<ProdData />)
    });
  }
});

privlegedRoutes.route('/overview', {
  name: 'overview',
  action() {
    mount(CleanLayout, {
      content: ( <OverviewData /> )
    });
  }
});

privlegedRoutes.route('/people', {
  action() {
    mount(CleanLayout, {
       content: (<PeopleDataWrap />)
    });
  }
});

// Downstream Routing
privlegedRoutes.route('/downstream', {
  action() {
    mount(CleanLayout, {
      content: ( <DownstreamData /> )
    });
  }
});

privlegedRoutes.route('/downstream/:view', {
  name: 'downstream', // optional
  // do some action for this route
  action: function(params) {
    mount(CleanLayout, {
      content: ( <DownstreamData view={params.view} /> )
    });
  },
});

// Upstream Routing
privlegedRoutes.route('/upstream', {
  action() {
    mount(CleanLayout, {
      content: ( <UpstreamData /> )
    });
  }
});

privlegedRoutes.route('/upstream/:view', {
  name: 'upstream', // optional
  // do some action for this route
  action: function(params) {
    mount(CleanLayout, {
      content: ( <UpstreamData view={params.view} /> )
    });
  },
});

privlegedRoutes.route('/print/generallabel/:batch', {
  action: function(params, queryParams) {
    if(queryParams !== null && typeof queryParams === 'object') {
      const request = Object.keys(queryParams);
      if(
        request.includes('group') &&
        request.includes('widget') &&
        request.includes('ver') &&
        request.includes('desc') &&
        request.includes('sales') &&
        request.includes('quant')
      ) {
        mount(LabelLayout, {
          content: (<GeneralLabel batch={params.batch} data={queryParams} />)
        });
      }else{
        mount(SplashLayout, {
          content: (<p>Cannot Generate this page. Incomplete information</p>),
          title: 'Error'
        });
      }
    }else{
      mount(SplashLayout, {
        content: (<p>Page Not Found</p>),
        title: '404'
      });
    }
  },
  name: 'print'
});


// Explore Routing

privlegedRoutes.route('/data', {
  action() {
    mount(CleanLayout, {
      content: (<DataData />)
    });
  }
});

// FlowRouter.go('/data/my-post?comments=on&color=dark');

privlegedRoutes.route('/data/:view', {
  name: 'explore', // optional
  // do some action for this route
  action: function(params, queryParams) {
    //console.log("Params:", params);
    //console.log("Query:", queryParams);
    mount(CleanLayout, {
      content: (<DataData
                  view={params.view}
                  request={queryParams.request}
                  specify={queryParams.specify}
                  subLink={params.view + queryParams.request} />
                )
    });
  },
});

new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);

// Set default JS and CSS for all routes
FlowRouter.globals.push({
  title: "neptune",
  link: {
    favi: {
      href: "/logoColorMini.png",
      sizes: "16x16 32x32 64x64",
      rel: "icon"
    },
    manifest: {
      href: "/pwa_manifest.json",
      rel: "manifest",
    },
  },
  /*
  script: {
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'
  }
  */
  meta: {
    meta00: {
      charset: "UTF-8"
    },
    meta0: {
      lang: 'en'
    },
    meta1: {
      name: "theme-color",
      content: "#007fff"
    },
    meta2: {
      name: "mobile-web-app-capable",
      content: "yes"
    },
    meta3: {
      name: "apple-mobile-web-app-capable" ,
      content: "yes"
    },
    meta4: {
      name: "viewport",
      content: "minimum-scale=0.25, maximum-scale=3"
    }
  }
});

// Background Connections

var disconnectTimer = null;

Meteor.startup(disconnectIfHidden);

document.addEventListener('visibilitychange', disconnectIfHidden);

function disconnectIfHidden() {
  removeDisconnectTimeout();

  if(document.hidden) {
    createDisconnectTimeout();
  }else {
    Meteor.reconnect();
  }
}

function createDisconnectTimeout() {
  removeDisconnectTimeout();

  disconnectTimer = setTimeout(function () {
    Meteor.disconnect();
  },1000 * 60 * 5);
}

function removeDisconnectTimeout() {
  if(disconnectTimer) {
    clearTimeout(disconnectTimer);
  }
}

Accounts.onLogin( ()=>{
	let redirect = Session.get('redirectAfterLogin');
  if(!redirect || redirect === '/login') {
  	null;
  }else {
    FlowRouter.go(redirect);
  }
  
  if(Roles.userIsInRole(Meteor.userId(), 'debug') && 
    !Roles.userIsInRole(Meteor.userId(), 'admin')
  ) {
  	const agent = window.navigator.userAgent;
  	const sessionID = Meteor.connection._lastSessionId;
  	Meteor.call('logLogInOut', true, agent, sessionID);
    alert('Your account is in debug mode. \n Your activity may be monitored and recorded. \n See your Neptune administrator for more information');
	}
});

Accounts.onLogout( ()=>{
  Session.set('redirectAfterLogin', FlowRouter.current().path);
  FlowRouter.go('login');
});