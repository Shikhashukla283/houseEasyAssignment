const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || "Internal Server Error";

    if (err.code === "VALIDATION_ERROR") {
        statusCode = 400;
        errorMessage = "Validation Error";
    } else if (err.code === "UNAUTHORIZED") {
        statusCode = 401;
        errorMessage = "Unauthorized";
    } else if (err.code === "FORBIDDEN") {
        statusCode = 403;
        errorMessage = "Forbidden";
    }

    return res.status(statusCode).json({
        data: null,
        error: {
            code: statusCode,
            message: errorMessage,
        },
    });
};

module.exports = errorHandler;
