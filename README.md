# Admin panel

The admin panel is a browser-based interface for managing the portfolio site's
About content, posts, projects, and contact messages. It is built with React
loaded from CDN scripts and does not currently use a package manager or build
step.

## Requirements

- The Flask API in `Backend/` must be running at `http://127.0.0.1:5000`.
- A PostgreSQL database must be configured for the API.
- An internet connection is needed to load React, React Router, Babel, and
  Axios from their CDNs.

## Run locally

From the project root, start a static file server:

```powershell
python -m http.server 8001
```

Open [http://127.0.0.1:8001/admin/](http://127.0.0.1:8001/admin/) in a browser.
Start the backend separately; see [Backend README](../Backend/README.md).

## Sign in

The current login form uses a temporary, client-side demo check:

- Username: `*****`
- Password: `******`

This is not real authentication. The API's admin operations are not protected
by server-side authentication, so do not expose this setup to the public
internet or use it for production.

## Features

- View and approve posts, and edit their title, description, and content.
- Add and delete projects.
- Edit the About description and skills.
- View and delete submitted contact messages.

The interface is implemented in `dashboard.js`; `login.js` implements the
login screen, `routing.js` defines the client-side routes, and `app.js` mounts
the application. `index.html` loads the scripts and styles in the required
order.

