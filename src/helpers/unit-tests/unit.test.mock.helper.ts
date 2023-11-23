export const mockRequest = () => {
    const req: any = {};
    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    req.query = jest.fn().mockReturnValue(req);
    req.header = jest.fn().mockImplementation(() => {
        return null;
    });
    req.headers = {};
    return req;
};

export const mockResponse = () => {
    const res: any = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
