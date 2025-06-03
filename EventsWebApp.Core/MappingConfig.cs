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
            CreateMap<Event, EventDto>()
    .ForMember(dest => dest.CurrentParticipantsCount,
        opt => opt.MapFrom(src => src.Participants.Count));
            CreateMap<Event, EventCreateDto>().ReverseMap();
            CreateMap<Event, EventUpdateDto>().ReverseMap();
            CreateMap<Participant, ParticipantDto>().ReverseMap();
            CreateMap<Participant, ParticipantCreateDto>().ReverseMap();
            CreateMap<Participant, ParticipantUpdateDto>().ReverseMap();
            CreateMap<UserDto, AppUser>().ReverseMap();
            CreateMap<UserDto, LoginRequestDTO>().ReverseMap();
        }
    }
}
