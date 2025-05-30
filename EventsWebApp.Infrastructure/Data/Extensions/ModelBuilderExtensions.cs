using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using EventsWebApp.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EventsWebApp.Infrastructure.Data.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void ConfigureEntities(this ModelBuilder modelBuilder)
        {
            // Configure AppUser
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
                entity.Property(u => u.UserName).IsRequired().HasMaxLength(256);
                entity.Property(u => u.NormalizedEmail).HasMaxLength(256);
                entity.Property(u => u.NormalizedUserName).HasMaxLength(256);
            });

            // Configure Event
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Venue).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
                entity.Property(e => e.MaxParticipants).IsRequired();
            });

            // Configure Participant
            modelBuilder.Entity<Participant>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(50);
                entity.Property(p => p.Surname).IsRequired().HasMaxLength(50);
                entity.Property(p => p.Email).IsRequired().HasMaxLength(100);
                entity.Property(p => p.RegistrationDate).IsRequired();
                entity.Property(p => p.UserId).IsRequired();

                entity.HasOne(p => p.Event)
                    .WithMany(e => e.Participants)
                    .HasForeignKey(p => p.EventId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(p => p.User)
                    .WithMany()
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        public static void Seed(this ModelBuilder modelBuilder)
        {
            // Seed sample events
            modelBuilder.Entity<Event>().HasData(
                new Event
                {
                    Id = 1,
                    Title = "Tech Conference 2025",
                    Description = "Annual technology conference featuring the latest innovations and industry leaders.",
                    DateTime = new DateTime(2025, 7, 30, 10, 0, 0, DateTimeKind.Utc),
                    Venue = "Convention Center, New York",
                    Category = "Technology",
                    MaxParticipants = 50,
                    ImageUrl = "https://files.energomera.ru/files/f1f837fb917fb8d55fa19cf656b82116.jpg"
                },
                new Event
                {
                    Id = 2,
                    Title = "Startup Networking Mixer",
                    Description = "Networking event for entrepreneurs and startup enthusiasts.",
                    DateTime = new DateTime(2025, 6, 20, 18, 30, 0, DateTimeKind.Utc),
                    Venue = "Innovation Hub, San Francisco",
                    Category = "Networking",
                    MaxParticipants = 2,
                    ImageUrl = "https://marketing.hse.ru/data/2022/07/11/1634985082/iStock-1213693378.jpg"
                }
            );
        }
    }
}
