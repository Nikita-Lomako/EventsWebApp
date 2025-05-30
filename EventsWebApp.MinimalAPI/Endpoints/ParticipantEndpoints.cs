using EventsWebApp.Core.Dtos;
using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using EventsWebApp.Core.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventsWebApp.MinimalAPI.Endpoints
{
    public static class ParticipantEndpoints
    {
        public static void MapParticipantEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/participants")
                .WithTags("Participants");

            group.MapGet("/", GetAllParticipants)
                .WithName("GetAllParticipants")
                .WithSummary("Get all participants")
                .Produces<List<ParticipantDto>>(200)
                .RequireAuthorization("AdminOnly");

            group.MapGet("/{id}", GetParticipantById)
                .WithName("GetParticipantById")
                .WithSummary("Get participant by ID")
                .Produces<ParticipantDto>(200)
                .Produces(404)
                .RequireAuthorization();

            group.MapGet("/event/{eventId}", GetParticipantsByEvent)
                .WithName("GetParticipantsByEvent")
                .WithSummary("Get all participants for a specific event")
                .Produces<List<ParticipantDto>>(200)
                .RequireAuthorization();

            group.MapGet("/user", GetParticipantsByUser)
                .WithName("GetParticipantsByUser")
                .WithSummary("Get all participants for the current user")
                .Produces<List<ParticipantDto>>(200)
                .RequireAuthorization();

            group.MapPost("/", RegisterForEvent)
                .WithName("RegisterForEvent")
                .WithSummary("Register for an event")
                .Accepts<ParticipantCreateDto>("application/json")
                .Produces<ParticipantDto>(201)
                .Produces(400)
                .Produces(404)
                .RequireAuthorization();

            group.MapDelete("/{id}", CancelRegistration)
                .WithName("CancelRegistration")
                .WithSummary("Cancel event registration")
                .Produces(204)
                .Produces(404)
                .RequireAuthorization();
        }

        private static async Task<IResult> GetAllParticipants(
            IParticipantRepository participantRepository,
            IMapper mapper)
        {
            var participants = await participantRepository.GetAllAsync();
            var participantDtos = mapper.Map<List<ParticipantDto>>(participants);
            return Results.Ok(participantDtos);
        }

        private static async Task<IResult> GetParticipantById(
            int id,
            IParticipantRepository participantRepository,
            IMapper mapper,
            ClaimsPrincipal user)
        {
            var participant = await participantRepository.GetByIdAsync(id);
            if (participant == null)
                return Results.NotFound();

            // Only allow access if user is admin or the participant themselves
            if (!user.IsInRole("Admin") && participant.UserId != user.FindFirstValue(ClaimTypes.NameIdentifier))
                return Results.Forbid();

            var participantDto = mapper.Map<ParticipantDto>(participant);
            return Results.Ok(participantDto);
        }

        private static async Task<IResult> GetParticipantsByEvent(
            int eventId,
            IParticipantRepository participantRepository,
            IMapper mapper)
        {
            var participants = await participantRepository.GetByEventIdAsync(eventId);
            var participantDtos = mapper.Map<List<ParticipantDto>>(participants);
            return Results.Ok(participantDtos);
        }

        private static async Task<IResult> GetParticipantsByUser(
            IParticipantRepository participantRepository,
            IMapper mapper,
            ClaimsPrincipal user)
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var participants = await participantRepository.GetByUserIdAsync(userId);
            var participantDtos = mapper.Map<List<ParticipantDto>>(participants);
            return Results.Ok(participantDtos);
        }

        private static async Task<IResult> RegisterForEvent(
            ParticipantCreateDto participantDto,
            IParticipantRepository participantRepository,
            IEventRepository eventRepository,
            IMapper mapper,
            IValidator<ParticipantCreateDto> validator,
            ClaimsPrincipal user)
        {
            var validationResult = await validator.ValidateAsync(participantDto);
            if (!validationResult.IsValid)
                return Results.BadRequest(validationResult.Errors);

            // Check if event exists
            var eventExists = await eventRepository.ExistsAsync(participantDto.EventId);
            if (!eventExists)
                return Results.NotFound("Event not found");

            // Check if user is already registered
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var isRegistered = await participantRepository.IsUserRegisteredForEventAsync(userId, participantDto.EventId);
            if (isRegistered)
                return Results.BadRequest("User is already registered for this event");

            var participant = mapper.Map<Participant>(participantDto);
            participant.UserId = userId;
            participant.RegistrationDate = DateTime.Now;

            participant = await participantRepository.CreateAsync(participant);
            var participantDto = mapper.Map<ParticipantDto>(participant);

            return Results.Created($"/api/participants/{participantDto.Id}", participantDto);
        }

        private static async Task<IResult> CancelRegistration(
            int id,
            IParticipantRepository participantRepository,
            ClaimsPrincipal user)
        {
            var participant = await participantRepository.GetByIdAsync(id);
            if (participant == null)
                return Results.NotFound();

            // Only allow cancellation if user is admin or the participant themselves
            if (!user.IsInRole("Admin") && participant.UserId != user.FindFirstValue(ClaimTypes.NameIdentifier))
                return Results.Forbid();

            await participantRepository.RemoveAsync(participant);
            return Results.NoContent();
        }
    }
} 