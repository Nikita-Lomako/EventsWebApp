namespace EventsWebApp.Core.Dtos
{
    public class ParticipantCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public int EventId { get; set; }
    }
} 