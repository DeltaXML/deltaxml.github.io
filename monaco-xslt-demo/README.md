This web project has the following setup:

* www/ - the web assets for the project
    * index.html - the entry point into the app.
    * app.js - the top-level config script used by index.html
    * app/ - the directory to store project-specific scripts.
    * lib/ - the directory to hold third party scripts.
* tools/ - (not used) the build tools to optimize the project.
* run `npm install`
* if TypeScript is not installed or an old version is installed use either of the following:
    * `npm install -g typescript`
    * `npm install -g typescript@latest`

For more information on using requirejs:
http://requirejs.org/docs/api.html
