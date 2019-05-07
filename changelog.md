# Changelog

This file is a record of notable changes made to Reeve.

## 1.2.0

### Added

-   Change Password Functionality
-   Set Default Language
-   User Profile Page
-   S3 Bucket Image Uploads
-   Signed Image Uploads
-   Cloudfront image loading
-   EmailVerified option to endpoint security
-   HideComponent component based on user restriction rules
-   Offline warning when connection to internet is lost
-   Application version to request headers
-   GDPR hard delete online account
-   Workspace branding settings
-   Settings Page
-   Async load Redux states
-   Updated NPM packages

### Fixed

-   Logo href links to homepage on authentication pages
-   Reload user on email validation
-   Firefox SVG image sizing issues
-   Organized scss files
-   Loading bar at top of screen
-   Loading bar not visible during async page loading
-   Improved react router implementation
-   Improved "Page could not be found" component
-   Select border radius
-   Notification text translates on language change
-   Hover link colors during client color change
-   Duplicate sessions on page refresh

## 1.1.0

### Added

-   Google Analytics Support
-   Gzip compression to bundle.js files
-   EMAIL_ENABLED environmental variable to enable/disable email sending
-   Reeve project icon returned to navigation header
-   Client logo in profile dropdown menu
-   Help bubble on navigation header
-   Gif image on bundle.js loading
-   Safe regex confirmation when validating subdomains

### Fixed

-   Replaced UglifyJS with Terser to provide ES6 support
-   Missing Bootstrap "Burger Menu Icon" replaced with SVG
-   Client styling not visible on user overview page
-   Deprecated updateAttributes sequelize function updated

## 1.0.1

### Fixed

-   Event-stream security vulnerability
-   Incorrect integration url pathways
-   Updated key packages to resolve event-stream issue

## 1.0.0

### Added

-   Server configuration & environment store
-   Express Server
-   Client interface using React front-end framework
-   SASS stylesheet handling
-   Bootstrap Framework
-   Webpack module bundler
-   i18n translations on front-end and back-end
-   Redux
-   React-Tooltips
-   Dropdown Alerts
-   AVA Test System
-   JS Validation
-   Redis
-   MySQL Server
-   Subdomains
-   Session Storage
-   React Router
-   User Authentication
-   Error Reporting
-   JSON Web Tokens
-   Polyfills & IE Support
-   Integrated NodeMailer for email handling
-   Sentry error reporting on front-end
-   Papertrail logging
-   API Rate Limiting
-   Developer Documentation
