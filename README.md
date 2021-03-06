Multi-brand external identity asset
====================

This will help you to set up a demo for multi-brand external identity. It is based on the salesforceidentity/embedded-login-example github repo. Start by deploying this package to 2 heroku apps, these will represent your 2 sites. 

Pre-requisites
--------------
You'll need an org that has a Community setup and active. Ideally you should have following the [Salesforce External Identity Implementation Guide](https://developer.salesforce.com/docs/atlas.en-us.externalidentityImplGuide.meta/externalidentityImplGuide/external_identity_intro.htm) to set up this org or you have completed the [Identity for Customers](https://trailhead.salesforce.com/module/identity_external) Trailhead module.

Steps to deploy
---------------
1. Deploy this app to Heroku [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/salesforceidentity/embedded-login-example)
2. Create a CORS entry for the deployed heroku app. [More details here](https://developer.salesforce.com/docs/atlas.en-us.externalidentityImplGuide.meta/externalidentityImplGuide/external_identity_login_step_1.htm)
3. Create a Connected App
	* Enable OAuth
	* Select openid scope
	* Set Callback to https://HEROKUAPP_URL/_callback.php e.g. https://strong-castle-20163.herokuapp.com/_callback.php
	* Save
	* Copy the Consumer Key
	* You will also want to Manage the Connected App and change the Permitted Users policy from User to Admin Approved. Then you will want to a Profile or Permission Set for the user you want to test.
4. Set the Heroku config vars via Setting > Reveal Config Vars:
	* "SALESFORCE_COMMUNITY_URL" to the Community's domain, no trailing slash and no "https://", For example: mycommunity.force.com/community2
	* "SALESFORCE_CLIENT_ID" to your Connected App's Consumer key
	* "SALESFORCE_HEROKUAPP_URL" to the URL of deployed Heroku App, no trailing slash and no "https://", for example bouncy-castle-1234.herokuapp.com
5. Optionally you can change the following Heroku config vars as well
	* "SALESFORCE_MODE" to either "modal" or "inline" to control how the login box is rendered
	* "SALESFORCE_FORGOT_PASSWORD_ENABLED" to either "true" or "false" depending if you want to display the forgot password link
	* "SALESFORCE_SELF_REGISTER_ENABLED" to either "true" or "false" depending if you want to display the user registration link
6. Now that you've deployed your 2 apps you can start to rebrand the apps by adding your own images. Most images are called from index.php, but the banner and background image are called from main.css so check both if you want to customise. 
7. To change the branding or customise the embedded widget, there are a css and a javascript file that are called from index.php from your community, that can be replaced with a different css and/or javascript file. Examples are included in this repo, called servlet.css and loginwidgetcontroller.js 
8. To show the power of the platform consider implementing a flow for a different registration journey for the different brands. This will most likely mean that you need to change the community 'Register' page and place your flow on that page in a flow wrapper aura component (the component ensures the expid is passed through properly). sample code will be included in the force-app folder. For the code to work you will need to create a few custom fields as called in the Register_CreateUser apex class (Consent__c and site__c on Contact and site__c on User) and create an Account record for each brand/site
9. Consider enabling Social login (you can add the buttons to one site only by adapting the javascript file that is called from index.php). a SocialRegistrationHandler is also included in the force-app folder.
