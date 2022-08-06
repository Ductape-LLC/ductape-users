const success = (data: any, meta = {}) => {
    return ({
        status: true,
        meta: meta,
        data: data
    })
};

export default success;