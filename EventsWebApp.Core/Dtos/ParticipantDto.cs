using System;

namespace EventsWebApp.Core.Dtos
{
    public class ParticipantDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public int EventId { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
} 