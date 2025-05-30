using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventsWebApp.Core.Dtos
{
    public class LoginResponseDTO
    {
        public required UserDto User { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
