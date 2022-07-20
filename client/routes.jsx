import React from 'react';
import {mount} from 'react-mounter';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';
import { toast } from 'react-toastify';

import Pref from '/client/global/pref.js';

import { PublicLayout } from './layouts/MainLayouts.jsx';
import { SplashLayout } from './layouts/MainLayouts.jsx';
import { CleanLayout } from './layouts/MainLayouts.jsx';
import { LabelLayout } from './layouts/MainLayouts.jsx';

import Login from './views/Login';
import MetaSlide from './views/app/appSlides/MetaSlide';
// import InitialSetup from './views/InitialSetup.jsx';

import ProdData from './views/production/ProdData';
import TerminalData from './views/proterminal/TerminalData';

import UpstreamData from './views/upstream/UpstreamData';
import OverviewData from './views/overview/OverviewData';
import DownstreamData from './views/downstream/DownstreamData';

import PeopleDataWrap from './views/people/PeopleDataWrap';
import UserDataWrap from './views/user/UserDataWrap';
import DataData from './views/data/DataData';
import AppData from './views/app/AppData';

import GeneralLabel from './views/paper/GeneralLabel';

import LandingWrap from './LandingWrap';

// Client Side Colllections
AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
VariantDB = new Mongo.Collection('variantdb');
XBatchDB = new Mongo.Collection('xbatchdb');
XSeriesDB = new Mongo.Collection('xseriesdb');
XRapidsDB = new Mongo.Collection('xrapidsdb');

EquipDB = new Mongo.Collection('equipdb');
MaintainDB = new Mongo.Collection('maintaindb');

TimeDB = new Mongo.Collection('timedb');
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
      content: (<p className='centreText bigger'>404 - Page Not Found</p>),
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
    });
  }
});

exposedRoutes.route('/meta', {
  name: 'meta',
  action() {
    mount(SplashLayout, {
      content: ( <MetaSlide /> )
    });
  }
});

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
      )
    });
  }
});
*/
privlegedRoutes.route('/', {
  name: 'home',
  action() {
    mount(CleanLayout, {
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

privlegedRoutes.route('/process', {
  name: 'terminal',
  action() {
    mount(CleanLayout, {
      content: (<TerminalData />)
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
  name: 'downstream',
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
  name: 'upstream',
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
        content: (<p className='centreText bigger'>Page Not Found</p>),
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

privlegedRoutes.route('/data/:view', {
  name: 'explore',
  action: function(params, queryParams) {
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
  },
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
  }
});

// Background Connections

var disconnectTimer = null;

function customViewHeight() { 
  document.querySelector(':root').style
    .setProperty('--vh', window.innerHeight/100 + 'px');
}

Meteor.startup(customViewHeight);

window.addEventListener('resize', customViewHeight);

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
  },1000 * 60 * Pref.blurOut);
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
    toast.warning(`Your account is in debug mode.\nYour activity may be monitored and recorded.\nSee your Neptune administrator for more information`, 
      { autoClose: false });
	}
});

Accounts.onLogout( ()=>{
  Session.set('redirectAfterLogin', FlowRouter.current().path);
  FlowRouter.go('login');
});