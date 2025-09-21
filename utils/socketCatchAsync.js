module.exports = fn => {
    return async (payload) => {
        try {
            const result = await fn(payload); // Now try-catch will catch ReferenceError
            return result;
        } catch (error) {
            throw error; // Optional: rethrow or handle
        }
    };
};