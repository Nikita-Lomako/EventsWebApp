using Microsoft.AspNetCore.Http;

namespace EventsWebApp.Core.Dtos
{
    public class EventCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DateTime { get; set; }
        public string Venue { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int MaxParticipants { get; set; }
        public string? ImageUrl { get; set; }
    }
} 