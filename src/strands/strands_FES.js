export function internalError(message) {
    const prefixedMessage = `[p5.strands internal error]: ${message}` 
    throw new Error(prefixedMessage);
}