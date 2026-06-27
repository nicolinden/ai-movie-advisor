import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        service: 'AI Movie Advisor API',
    });
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});