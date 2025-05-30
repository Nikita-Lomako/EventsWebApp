using Microsoft.AspNetCore.Identity;
using System;

namespace EventsWebApp.Core.Models
{
    public class AppUser : IdentityUser<Guid>
    {
        // Email and UserName will be used from IdentityUser
    }
}
