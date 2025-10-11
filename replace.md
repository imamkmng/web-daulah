Hello Claude, I need your help to refactor my project for deployment on Vercel.

My project is an interactive quiz about the Abbasid Caliphate. The frontend is built with HTML, CSS, and Vanilla JavaScript, while the backend is a Node.js/Express.js API for handling quiz scores. The main challenge is that I'm using a local SQLite file for the database, which won't work on Vercel's ephemeral filesystem.

Here is my current tech stack:
- **Frontend**: HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: A single `database.sqlite` file.
- **Library**: `json2csv` for an admin feature to download scores.
- **Color Scheme**: Dark Green (#084c41), Sage Green (#A3B899), Ivory (#F5F5DC), Gold (#C0A062).
- **Fonts**: 'Poppins' or 'Lato'.

I need you to perform the following tasks:

1.  **Create a `vercel.json` file**: Write the complete configuration file to handle a Node.js backend located in the `/api` directory and a static frontend in the `/public` directory. All requests to `/api/*` should be routed to the backend.

2.  **Refactor the Backend (`api/index.js`)**:
    * Modify the database connection logic. Please remove the direct file-based SQLite connection.
    * Replace it with a connection to **Turso**, a distributed SQLite-compatible database service suitable for serverless environments.
    * Use environment variables (`TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`) for the database credentials. Show me exactly how to use the `@libsql/client` library to connect.
    * Ensure all my existing Express routes (for getting scores, saving scores, and the `json2csv` download feature) are preserved and work with the new database connection method.

3.  **Update `package.json`**: Add any necessary dependencies for the new database driver (like `@libsql/client`) and remove the old `sqlite3` package if it's no longer needed.

4.  **Provide a `.gitignore` file**: Suggest a standard `.gitignore` file for a Node.js project to exclude `node_modules`, `.env` files, and the old `.sqlite` database file.

5.  **Explain the next steps**: Briefly explain how I should set up the project on Vercel, including where to add the new environment variables.

Please provide the complete, ready-to-use code for `vercel.json`, the refactored `api/index.js`, the updated `package.json`, and the `.gitignore` file.