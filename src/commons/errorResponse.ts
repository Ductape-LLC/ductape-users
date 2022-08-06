const error = (error: any, meta = {}) => {
    return ({
        status: false,
        meta: meta,
        errors: error
    })
};

export default error;