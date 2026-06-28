export const movieAnalysisSchema = {
    type: 'object',
    additionalProperties: false,
    required: [
        'summary',
        'suitableFor',
        'notSuitableFor',
        'mood',
        'complexity',
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
        whyWatch: {
            type: 'string',
        },
    },
} as const;