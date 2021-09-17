### Initial Setup

A new instance requires an organization entry in MongoDB collection 'AppDB' and 
a user account in MongoDB collection 'Meteor.users'.
 
The base app configuration is under 'addFirstSetting' in 'server/dbCRUD/appMethods'.

The initial account configuration is under 'Accounts.onCreateUser' in 'server/dbCRUD/userMethods'.

Default first user:
  - username : "administrator"
  - password : "riversserenity"
  - org      : "crew"

The user account must be linked to organization by matching "org" and "orgKey" keys and 
added to Roles "active" and "admin".

This setup can be initiated with Neptune.

1. Set Pref.InitialAppSetup to true
2. Un-comment 'addFirstSetting' in '/server/dbCRUD/appMethods'.
3. Un-comment 'initialsetup' in '/client/components/routes'.
4. Set first user setting starting line 24 of '/client/views/InitialSetup'. (Org name cannot be changed later)

5. Deploy

6. Navigate to [host]/initialsetup
7. Click "Setup App First"
8. Click "Create Admin Account Second"
9. Click "Go Home Third"

10. (recommended) Undo steps 1-3, then re-deploy.


### Email Setup

To enable email add enviroment variable:

MAIL_URL="smtps://[email address]:[password]@[email server]:[outgoing port]"

and enable "Enable Email" in Neptune Settings/Notifications