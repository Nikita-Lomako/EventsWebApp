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
            // Event mappings
            CreateMap<Event, EventDto>()
    .ForMember(dest => dest.CurrentParticipantsCount,
        opt => opt.MapFrom(src => src.Participants.Count));

            CreateMap<EventDto, Event>();

            CreateMap<EventCreateDto, Event>().ReverseMap();
            CreateMap<EventUpdateDto, Event>().ReverseMap();

            // Participant mappings
            CreateMap<Participant, ParticipantDto>().ReverseMap();
            CreateMap<ParticipantCreateDto, Participant>().ReverseMap();

            // User mappings
            CreateMap<UserDto, AppUser>().ReverseMap();
            CreateMap<UserDto, LoginRequestDTO>().ReverseMap();
        }
    }
}
