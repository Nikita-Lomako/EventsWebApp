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
            CreateMap<Event, EventDto>().ReverseMap()
                .ForMember(dest => dest.CurrentParticipantsCount,
                    opt => opt.MapFrom(src => src.Participants.Count));
            CreateMap<EventCreateDto, Event>().ReverseMap();
            CreateMap<EventUpdateDto, Event>().ReverseMap()
                .ForMember(dest => dest.LastUpdated, opt => opt.MapFrom(src => DateTime.Now));

            // Participant mappings
            CreateMap<Participant, ParticipantDto>().ReverseMap();
            CreateMap<ParticipantCreateDto, Participant>().ReverseMap();

            // User mappings
            CreateMap<AppUser, UserDto>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));

            CreateMap<RegistrationRequestDto, AppUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
        }
    }
}
