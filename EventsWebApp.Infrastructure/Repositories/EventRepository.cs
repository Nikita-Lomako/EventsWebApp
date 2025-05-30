using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using EventsWebApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace EventsWebApp.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _db;

        public EventRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ICollection<Event>> GetAllAsync()
        {
            return await _db.Events
                .Include(e => e.Participants)
                .ToListAsync();
        }

        public async Task<Event?> GetAsync(int id)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Event?> GetAsync(string title)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .FirstOrDefaultAsync(e => e.Title == title);
        }

        public async Task<ICollection<Event>> GetByDateAsync(DateTime date)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .Where(e => e.DateTime.Date == date.Date)
                .ToListAsync();
        }

        public async Task<ICollection<Event>> GetByLocationAsync(string location)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .Where(e => e.Venue.Contains(location))
                .ToListAsync();
        }

        public async Task<ICollection<Event>> GetByCategoryAsync(string category)
        {
            return await _db.Events
                .Include(e => e.Participants)
                .Where(e => e.Category == category)
                .ToListAsync();
        }

        public async Task CreateAsync(Event evt)
        {
            await _db.Events.AddAsync(evt);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Event evt)
        {
            _db.Events.Update(evt);
            await _db.SaveChangesAsync();
        }

        public async Task RemoveAsync(Event evt)
        {
            _db.Events.Remove(evt);
            await _db.SaveChangesAsync();
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _db.Events.AnyAsync(e => e.Id == id);
        }

        public async Task<bool> ExistsAsync(string title)
        {
            return await _db.Events.AnyAsync(e => e.Title == title);
        }

        public async Task<int> GetParticipantsCountAsync(int eventId)
        {
            return await _db.Participants
                .CountAsync(p => p.EventId == eventId);
        }
    }
} 