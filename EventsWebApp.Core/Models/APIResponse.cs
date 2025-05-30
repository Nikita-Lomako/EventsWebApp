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
        public APIResponse()
        {
            ErrorMessages = new List<string>();
        }
        public bool IsSuccess { get; set; }
        public Object Result { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public List<string> ErrorMessages { get; set; }
    }
}
