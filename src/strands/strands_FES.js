export function internalError(errorMessage) {
    const prefixedMessage = `[p5.strands internal error]: ${errorMessage}` 
    throw new Error(prefixedMessage);
}

export function userError(errorType, errorMessage) {
    const prefixedMessage = `[p5.strands ${errorType}]: ${errorMessage}`;
    throw new Error(prefixedMessage);
}

export function dimensionMismatchError(declaredDim,actualDim,varName){
    userError(
        'dimension mismatch',
    `Cannot assign a value of dimension ${actualDim} to \`${varName}\`, which expects dimension ${declaredDim}.`
    );
}