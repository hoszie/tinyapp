# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). 

## Final Product

!["Screenshoot of the registration page"](https://github.com/hoszie/tinyapp/blob/master/docs/registration-page.png?raw=true)
!["Screenshoot of the URLs page"](https://github.com/hoszie/tinyapp/blob/master/docs/urls-page.png?raw=true)
!["Screenshoot of the new URLs page"](https://github.com/hoszie/tinyapp/blob/master/docs/urls-new-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Features

- Must be registered and logged in to use the application. If you attempt to create a new shortened URL without being logged in you will be redirected to the login page.
- Once registered and logged in, you are able to create a list of shortened URLs which will persist after logging out and loggin back in.
- Passwords and cookies are encrypted.
