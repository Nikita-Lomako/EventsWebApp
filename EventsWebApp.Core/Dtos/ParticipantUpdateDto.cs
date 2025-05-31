using System;

namespace EventsWebApp.Core.Dtos
{
    public class ParticipantUpdateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
    }
} 