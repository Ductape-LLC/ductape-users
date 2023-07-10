export const removeRegEx = (exp: RegExp, str: string): string => {
    return str.replace(exp,'') ;
}