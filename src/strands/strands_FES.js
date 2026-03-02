export function internalError(errorMessage) {
    const prefixedMessage = `[p5.strands internal error]: ${errorMessage}` 
    throw new Error(prefixedMessage);
}

export function userError(errorType, errorMessage) {
    if (typeof window !== 'undefined' && window.mockUserError) {
        window.mockUserError(errorType, errorMessage);
    }
    const prefixedMessage = `[p5.strands ${errorType}]: ${errorMessage}`;
    throw new Error(prefixedMessage);
}