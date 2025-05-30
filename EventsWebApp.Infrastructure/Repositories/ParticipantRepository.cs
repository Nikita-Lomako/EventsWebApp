using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using EventsWebApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace EventsWebApp.Infrastructure.Repositories
{
    public class ParticipantRepository : IParticipantRepository
    {
        private readonly AppDbContext _db;

        public ParticipantRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ICollection<Participant>> GetAllAsync()
        {
            return await _db.Participants
                .Include(p => p.Event)
                .ToListAsync();
        }

        public async Task<Participant?> GetAsync(int id)
        {
            return await _db.Participants
                .Include(p => p.Event)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<ICollection<Participant>> GetByEventIdAsync(int eventId)
        {
            return await _db.Participants
                .Include(p => p.Event)
                .Where(p => p.EventId == eventId)
                .ToListAsync();
        }

        public async Task<ICollection<Participant>> GetByUserIdAsync(Guid userId)
        {
            return await _db.Participants
                .Include(p => p.Event)
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }

        public async Task CreateAsync(Participant participant)
        {
            await _db.Participants.AddAsync(participant);
            await _db.SaveChangesAsync();
        }

        public async Task RemoveAsync(Participant participant)
        {
            _db.Participants.Remove(participant);
            await _db.SaveChangesAsync();
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _db.Participants.AnyAsync(p => p.Id == id);
        }

        public async Task<bool> IsUserRegisteredForEventAsync(Guid userId, int eventId)
        {
            return await _db.Participants
                .AnyAsync(p => p.UserId == userId && p.EventId == eventId);
        }
    }
} 