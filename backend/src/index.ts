import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        service: 'AI Movie Advisor API',
    });
});

app.get('/api/movies/search', async (req, res) => {
    const query = req.query.query;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({
            error: 'Valid query parameter is required',
        });
    }

    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
        return res.status(500).json({
            error: 'TMDB_ACCESS_TOKEN is not configured',
        });
    }

    const url = new URL('https://api.themoviedb.org/3/search/movie');
    url.searchParams.set('query', query);
    url.searchParams.set('language', 'en-US');
    url.searchParams.set('include_adult', 'false');

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
        },
    });

    if (!response.ok) {
        return res.status(response.status).json({
            error: 'TMDb request failed',
        });
    }

    const data = await response.json();

    const movies = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : null,
        overview: movie.overview,
    }));

    res.json({
        query,
        results: movies,
    });
});

/*
 * Alleen gebruiken in productie.
 * Tijdens development draait Angular via ng serve.
 */
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../public');

    app.use(express.static(frontendPath));

    app.use((_req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});