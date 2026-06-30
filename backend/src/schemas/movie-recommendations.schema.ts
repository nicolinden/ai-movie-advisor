export const movieRecommendationsSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['recommendations'],
    properties: {
        recommendations: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'reason', 'matchStrength'],
                properties: {
                    id: {
                        type: 'number',
                    },
                    reason: {
                        type: 'string',
                    },
                    matchStrength: {
                        type: 'string',
                        enum: ['Low', 'Medium', 'High'],
                    }
                }
            }
        }

    }
} as const;