const HTTP_CODES = {
    SUCCESS: 200,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHORISED: 401,
    NOT_FOUND: 404,
    RESOURCE_MOVED: 410,
    TEMPORARAY_DOWN: 503,
    TIME_OUT: 504,
    NO_ACCESS: 403,
    CONFLICT: 409
};

export default {
    MISSING_PARAMETER: {
        code: "1001",
        message: "Invalid request, Missing parameter",
        status: HTTP_CODES.BAD_REQUEST
    }
}