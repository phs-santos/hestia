import express, { Express, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupSPA(app: Express) {
    const ROOT_DIR = path.resolve(__dirname, '../..');
    const CLIENT_BUILD_PATH = path.join(ROOT_DIR, 'client/dist');

    // Serve static files from the React app
    app.use(express.static(CLIENT_BUILD_PATH));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
        res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
    });
}
