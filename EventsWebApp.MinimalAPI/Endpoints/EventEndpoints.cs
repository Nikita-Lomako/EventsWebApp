using AutoMapper;
using EventsWebApp.Core.Dtos;
using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using EventsWebApp.Core.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventsWebApp.MinimalAPI.Endpoints
{
    public static class EventEndpoints
    {
        public static void MapEventEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/events")
                .WithTags("Events");

            group.MapGet("/", GetAllEvents)
                .WithName("GetAllEvents")
                .WithSummary("Get all events")
                .Produces<APIResponse>(200);

            group.MapGet("/{id}", GetEventById)
                .WithName("GetEventById")
                .WithSummary("Get event by ID")
                .Produces<EventDto>(200)
                .Produces(404);

            group.MapGet("/search", SearchEvents)
                .WithName("SearchEvents")
                .WithSummary("Search events by various criteria")
                .Produces<List<EventDto>>(200);

            group.MapPost("/", CreateEvent)
                .WithName("CreateEvent")
                .WithSummary("Create a new event")
                .Accepts<EventCreateDto>("application/json")
                .Produces<EventDto>(201)
                .Produces(400)
                .RequireAuthorization("AdminOnly");

            group.MapPut("/{id}", UpdateEvent)
                .WithName("UpdateEvent")
                .WithSummary("Update an existing event")
                .Accepts<EventUpdateDto>("application/json")
                .Produces<EventDto>(200)
                .Produces(400)
                .Produces(404)
                .RequireAuthorization("AdminOnly");

            group.MapDelete("/{id}", DeleteEvent)
                .WithName("DeleteEvent")
                .WithSummary("Delete an event")
                .Produces(204)
                .Produces(404)
                .RequireAuthorization("AdminOnly");
        }

        private static async Task<IResult> GetAllEvents(
            IEventRepository eventRepository,
            IMapper mapper)
        {
            var events = await eventRepository.GetAllAsync();
            var eventDtos = mapper.Map<List<EventDto>>(events);
            return Results.Ok(eventDtos);
        }

        private static async Task<IResult> GetEventById(
            int id,
            IEventRepository eventRepository,
            IMapper mapper)
        {
            var eventEntity = await eventRepository.GetAsync(id);
            if (eventEntity == null)
                return Results.NotFound();

            var eventDto = mapper.Map<EventDto>(eventEntity);
            return Results.Ok(eventDto);
        }

        private static async Task<IResult> SearchEvents(
            [FromQuery] string? date,
            [FromQuery] string? location,
            [FromQuery] string? category,
            IEventRepository eventRepository,
            IMapper mapper)
        {
            IEnumerable<Event> events;

            if (!string.IsNullOrEmpty(date) && DateTime.TryParse(date, out DateTime parsedDate))
                events = await eventRepository.GetByDateAsync(parsedDate);
            else if (!string.IsNullOrEmpty(location))
                events = await eventRepository.GetByLocationAsync(location);
            else if (!string.IsNullOrEmpty(category))
                events = await eventRepository.GetByCategoryAsync(category);
            else
                events = await eventRepository.GetAllAsync();

            var eventDtos = mapper.Map<List<EventDto>>(events);
            return Results.Ok(eventDtos);
        }

        private static async Task<IResult> CreateEvent(
            EventCreateDto eventDto,
            IEventRepository eventRepository,
            IMapper mapper,
            IValidator<EventCreateDto> validator)
        {
            var validationResult = await validator.ValidateAsync(eventDto);
            if (!validationResult.IsValid)
                return Results.BadRequest(validationResult.Errors);

            var eventEntity = mapper.Map<Event>(eventDto);
            await eventRepository.CreateAsync(eventEntity);
            var createdEventDto = mapper.Map<EventDto>(eventEntity);

            return Results.Created($"/api/events/{createdEventDto.Id}", createdEventDto);
        }

        private static async Task<IResult> UpdateEvent(
            int id,
            EventUpdateDto eventDto,
            IEventRepository eventRepository,
            IMapper mapper,
            IValidator<EventUpdateDto> validator)
        {
            var validationResult = await validator.ValidateAsync(eventDto);
            if (!validationResult.IsValid)
                return Results.BadRequest(validationResult.Errors);

            var existingEvent = await eventRepository.GetAsync(id);
            if (existingEvent == null)
                return Results.NotFound();

            mapper.Map(eventDto, existingEvent);
            await eventRepository.UpdateAsync(existingEvent);
            var updatedEventDto = mapper.Map<EventDto>(existingEvent);

            return Results.Ok(updatedEventDto);
        }

        private static async Task<IResult> DeleteEvent(
            int id,
            IEventRepository eventRepository)
        {
            var existingEvent = await eventRepository.GetAsync(id);
            if (existingEvent == null)
                return Results.NotFound();

            await eventRepository.RemoveAsync(existingEvent);
            return Results.NoContent();
        }
    }
}