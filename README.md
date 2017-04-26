St4tebr1dge!
# SecularHubMembers
https://www.youtube.com/watch?v=Shhhn6lu0Nc

#Prerequesites
First make sure angular-cli is installed!
npm install -g angular-cli


# this is for third party libraries only
npm install d3 --save
npm install @types/d3 --save-dev

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.24.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
<VirtualHost *:443>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
        SSLEngine On
        # Set the path to SSL certificate
        # Usage: SSLCertificateFile /path/to/cert.pem
        SSLCertificateFile /etc/apache2/ssl/ca.crt
        SSLCertificateKeyFile /etc/apache2/ssl/ca.key
        ProxyPreserveHost On
        ProxyPass /var/www/ http://localhost:3035/
        ProxyPassReverse /var/www/ http://localhost:3035/
        ServerName localhost
</VirtualHost>
