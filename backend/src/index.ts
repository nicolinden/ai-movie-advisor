import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { executeJsonPrompt } from './services/openai.service.js';
import { getMovieDetail, searchMovies } from './services/tmdb.service.js';
import { createMovieAnalysisPrompt } from './prompts/movie-analysis.prompt.js';
import { movieAnalysisSchema } from './schemas/movie-analysis.schema.js';

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
    try {
        const query = req.query.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                error: 'Valid query parameter is required',
            });
        }

        const result = await searchMovies(query);
        res.json(result);
    } catch (error) {
        console.error('Movie search failed:', error);

        res.status(502).json({
            error: 'Movie provider failed',
        });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await getMovieDetail(req.params.id);
        res.json(movie);
    } catch (error) {
        console.error('Movie detail failed:', error);

        res.status(502).json({
            error: 'Movie provider failed',
        });
    }
});

app.post('/api/movies/:id/analyze', async (req, res) => {
    try {
        const movieDetail = await getMovieDetail(req.params.id);
        const prompt = createMovieAnalysisPrompt(movieDetail);
        const analysis = await executeJsonPrompt(
            prompt,
            movieAnalysisSchema,
            'movie_analysis'
        );

        res.json(analysis);
    } catch (error) {
        console.error('Movie analysis failed:', error);

        res.status(500).json({
            error: 'Movie analysis failed',
        });
    }
});

/*
 * Alleen gebruiken in productie.
 * Tijdens development draait Angular via ng serve.
 * Belangrijk: deze fallback moet altijd NA alle /api routes staan.
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