using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventsWebApp.Core.Models
{
    public class Participant
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Surname { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateOfBirth { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        
        public int EventId { get; set; }
        
        [ForeignKey("EventId")]
        public Event Event { get; set; } = null!;
        
        public Guid UserId { get; set; }
        
        [ForeignKey("UserId")]
        public AppUser User { get; set; } = null!;
    }
} 