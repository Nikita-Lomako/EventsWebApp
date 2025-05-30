using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace EventsWebApp.Core.Models
{
    public class APIResponse
    {
        public bool IsSuccess { get; set; }
        public object? Result { get; set; }
        public string? ErrorMessage { get; set; }
        public List<string>? ErrorMessages { get; set; }
        public int StatusCode { get; set; }

        public static APIResponse Success(object? result = null, int statusCode = 200)
        {
            return new APIResponse
            {
                IsSuccess = true,
                Result = result,
                StatusCode = statusCode
            };
        }

        public static APIResponse Error(string errorMessage, int statusCode = 400)
        {
            return new APIResponse
            {
                IsSuccess = false,
                ErrorMessage = errorMessage,
                StatusCode = statusCode
            };
        }

        public static APIResponse Error(List<string> errorMessages, int statusCode = 400)
        {
            return new APIResponse
            {
                IsSuccess = false,
                ErrorMessages = errorMessages,
                StatusCode = statusCode
            };
        }
    }
}
