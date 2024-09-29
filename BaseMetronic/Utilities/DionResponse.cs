namespace BaseMetronic.Utilities
{
    public class DionResponse
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public object Resources { get; set; }
        public object Errors { get; set; } = new List<string>();
        public bool IsSucceeded { get; set; }

        private DionResponse()
        {
        }

        public static DionResponse Success(string? message = "Success")
        {
            return new DionResponse()
            {
                Status = 200,
                Message = message,
                IsSucceeded = true,
            };
        }

        public static DionResponse Success(object data, string? message = "Success")
        {
            return new DionResponse()
            {
                Status = 200,
                Message = message,
                Resources = data,
                IsSucceeded = true
            };
        }

        public static DionResponse Success<T>(T? data, string? message = "Success") where T : class
        {
            return new DionResponse()
            {
                Status = 200,
                Message = message,
                IsSucceeded = true,
                Resources = data
            };
        }
        public static DionResponse Created<T>(T data)
        {
            return new DionResponse()
            {
                Status = 201,
                Message = "Created",
                IsSucceeded = true,
                Resources = data
            };
        }
        public static DionResponse Error(int status, object errors, string? message = null)
        {
            return new DionResponse()
            {
                Status = status,
                Message = message,
                Errors = errors,
                IsSucceeded = false
            };
        }

        public static DionResponse Error(string? message = "Error")
        {
            return new DionResponse()
            {
                Status = 400,
                Message = message,
                IsSucceeded = false
            };
        }

        public static DionResponse NotFound(string Message = "NotFound", object? errors = null)
        {
            if (errors == null)
            {
                errors = new List<string>();
            }
            return Error(404, errors, Message);
        }


        public static DionResponse BadRequest(string Message = "BadRequest", object? errors = null)
        {
            if(errors == null)
            {
                errors = new List<string>();
            }
            return Error(400, errors, "BadRequest");
        }
        public static DionResponse BadRequest()
        {
            return Error(400, new string[] { }, "BadRequest");
        }


        public static DionResponse Unauthorized(object errors)
        {
            return Error(401, errors, "Unauthorized");
        }

        public static DionResponse Forbidden(object errors)
        {
            return Error(403, errors, "Forbidden");
        }
    }
}
