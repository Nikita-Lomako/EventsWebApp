using AutoMapper;
using EventsWebApp.Core.Dtos;
using EventsWebApp.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventsWebApp.Core
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<UserDTO, AppUser>().ReverseMap();
            CreateMap<UserDTO, LoginRequestDTO>().ReverseMap();
        }
    }
}
