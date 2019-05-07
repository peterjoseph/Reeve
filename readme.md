# ![](https://i.imgur.com/KnxoW1c.png)

### Web application scaffolding for production environments.

Reeve is a boilerplate framework that assists developers in reducing the setup time required to build production-ready scalable web applications.

The project was born out of a desire to solve very common yet frustrating problems when developing new minimum viable products (mvp’s). A large amount of time needs to be invested in building the platform that “hosts” the solution.

Most applications have a consistent set of services they depend upon. User authentication and management, payment and subscriptions, routing, internationalization, security, error reporting, and logging.

Reeve aims to provide a robust set of solutions to these areas so that you can focus your time on solving the problems that will provide you with an mvp faster.

## Quickstart

```
git clone https://github.com/peterjoseph/Reeve.git
cd Reeve
npm install && npm start
```

## Online Application Demo

Heroku Demo [Master Branch] <http://demo.getreeve.com/signin>

Heroku Demo [Development Branch] <http://demo-development.getreeve.com/signin>

-   Some features such as stripe billing and email sending in the online demo versions have been disabled.

## Application Screenshots

![](https://i.imgur.com/c6cYmSl.png)

![](https://i.imgur.com/naX75BZ.png)

![](https://i.imgur.com/BtDKKmH.png)

## Server Architecture

![](https://i.imgur.com/662XXKg.png)

## Key Integrations

-   [x] Express Server
-   [x] React
-   [x] Redux
-   [x] Server Configuration & Environment Store
-   [x] Webpack
-   [x] Redis
-   [x] MySQL Server
-   [x] SASS
-   [x] Bootstrap
-   [x] i18n Translation File Support
-   [x] React-Tooltips
-   [x] Dropdown Alerts
-   [x] AVA Test System
-   [x] JS Validation
-   [x] Google Analytics
-   [x] Subdomains
-   [x] Session Storage
-   [x] React Router
-   [x] User Authentication
-   [x] Error Reporting
-   [x] JSON Web Tokens
-   [x] Polyfills & IE Support
-   [x] Email Sending
-   [x] Sentry error logging
-   [x] Papertrail logging
-   [x] API Rate Limiting
-   [ ] Stripe Payment & Subscription Gateway

## Boilerplate Pages

-   [x] Enter Subdomain
-   [x] Log-In
-   [x] Sign-Up
-   [x] Forgot Password
-   [x] User Profile
-   [x] Change Password
-   [ ] Billing
-   [x] Application Settings

## Documentation

Further documentation can be found in the ./documentation directory of the repository.

An online copy of the documentation can be found at <https://getreeve.com/documentation.html>

## Feature Updates

The following public trello board provides scope for some of the features that are planned in future versions of Reeve.

<https://trello.com/b/pxdfRq4i>

## License

MIT License

Copyright (c) 2019 Peter Joseph

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
