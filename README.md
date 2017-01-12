# express-server

Creating a web server with Express.js

## Setup

* Clone this repo and `cd` into the folder
* Install the dependencies with `npm install`
* Create a branch for your pair


## 1. Respond with a string

* Create a route called `/compliment` to `server.js` that responds with a nice compliment.
* Add some HTML markup to that string to dress it up.
* Start the server using `npm start`.
* Make sure it works by going to [http://localhost:3000/compliment](http://localhost:3000/compliment).
* Stage, commit and push your branch to GitHub.


## 2. Respond with a predefined file

* Create an HTML file called `silvia.html` that represents a user's profile.
  - Name, username, photo, favourite links, etc.
* Create a route called `/profile` that returns `silvia.html`.
* Make sure it works by going to [http://localhost:3000/profile](http://localhost:3000/profile).
* Stage, commit and push your branch to GitHub.


## 3. Respond based on the query

* Create an HTML file called `sampson.html` that represents another user profile.
  - You might consider starting by copying `silvia.html`.
* Change the `/profile` route to accept query string parameters.
* If you navigate to `/profile?name=silvia` return `silvia.html`.
* If you go to `/profile?name=sampson` show `sampson.html`.
* Stage, commit and push your branch to GitHub.


## 4. Respond based on a URL parameter

* Create a `/profiles` route (notice the `s`) that accepts an `:id` parameter.
* If you navigate to `/profile/1` return `silvia.html`.
* If you go to `/profile/2` show `sampson.html`.
* Stage, commit and push your branch to GitHub.


## 5. Enable a folder of static files

* Create a `public` folder in the project's main folder.
* Create a CSS file called `styles.css` that makes `silvia.html` and `sampson.html` look nicer and save it to the `public` folder. You might need to adjust the HTML files a bit.
* Add a link to `/styles.css` to `silvia.html` and `sampson.html` so the styles will be applied.
* Configure Express so it will serve static files from the `public` folder.
* Make sure steps 3 and 4 above still work and the styles are visible.
* Stage, commit and push your branch to GitHub.


## 6. Refactor

* Make sure your code is readable, doesn't contain any duplication, and has consistent indenting and appropriate naming.
* Make sure all previous steps still work.
* Stage, commit and push your branch to GitHub.

## 7. Post data to the server

* Install the `body-parser` npm module (`--save`) and add its middleware to `server.js`.
* Create an HTML page called `get-name.html` in your `public` folder.
* Add a form to `get-name.html` that has a `name` input field.
* The form should `post` to `/named-compliment`.
* Create a route called (`/named-compliment`) that responds with a nice compliment using the name. You can use `res.send('named compliment wrapped in HTML markup')`.
* Make sure it works by going to [http://localhost:3000/get-name.html](http://localhost:3000/get-name.html), insert a name and submit the form. The compliment should be specific to the name submitted.
* Stage, commit and push your branch to GitHub.
