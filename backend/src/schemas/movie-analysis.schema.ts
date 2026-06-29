export const movieAnalysisSchema = {
    type: 'object',
    additionalProperties: false,
    required: [
        'summary',
        'suitableFor',
        'notSuitableFor',
        'mood',
        'complexity',
        'highlights',
        'caveats',
        'bestMomentToWatch',
        'whyWatch',
    ],
    properties: {
        summary: {
            type: 'string',
        },

        suitableFor: {
            type: 'array',
            items: {
                type: 'string',
            },
        },

        notSuitableFor: {
            type: 'array',
            items: {
                type: 'string',
            },
        },

        mood: {
            type: 'string',
        },

        complexity: {
            type: 'string',
            enum: ['Low', 'Medium', 'High'],
        },

        highlights: {
            type: 'array',
            items: {
                type: 'string',
            },
        },

        caveats: {
            type: 'array',
            items: {
                type: 'string',
            },
        },

        bestMomentToWatch: {
            type: 'string',
        },

        whyWatch: {
            type: 'string',
        },
    },
} as const;