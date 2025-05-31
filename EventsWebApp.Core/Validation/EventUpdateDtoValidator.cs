using EventsWebApp.Core.Dtos;
using FluentValidation;

namespace EventsWebApp.Core.Validation
{
    public class EventUpdateDtoValidator : AbstractValidator<EventUpdateDto>
    {
        public EventUpdateDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .GreaterThan(0);

            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(1000);

            RuleFor(x => x.DateTime)
                .NotEmpty()
                .GreaterThan(DateTime.Now);

            RuleFor(x => x.Venue)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Category)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.MaxParticipants)
                .NotEmpty()
                .GreaterThan(0);

            RuleFor(x => x.ImageUrl)
                            .Must(url => url == null || url.StartsWith("http://") || url.StartsWith("https://"))
                            .WithMessage("Image URL must be a valid HTTP(S) URL");
        }
    }
}