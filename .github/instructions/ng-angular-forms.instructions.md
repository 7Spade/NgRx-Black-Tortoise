---
description: 'Configuration for AI behavior when implementing Angular Reactive Forms with validation and state integration'
applyTo: '**'
---

# Angular Forms Rules
Configuration for AI behavior when implementing Angular Reactive Forms

## CRITICAL: Use Reactive Forms for complex scenarios
- YOU MUST use Reactive Forms (`FormControl`, `FormGroup`, `FormArray`) for complex forms
- MUST NOT use template-driven forms for multi-field forms with validation
- Configure forms with proper typing:
  ```typescript
  userForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    age: new FormControl<number | null>(null, [Validators.min(18)])
  });
  ```
- > NOTE: Reactive Forms provide better type safety, testability, and state management

## When implementing form validation
- MUST add validators to all input controls:
  - Built-in: `Validators.required`, `Validators.email`, `Validators.min`, `Validators.max`, `Validators.pattern`
  - Custom validators for business rules
- Show validation errors only after field is touched:
  ```html
  @if (form.controls.email.invalid && form.controls.email.touched) {
    <mat-error>Invalid email</mat-error>
  }
  ```
- Disable submit button when form is invalid:
  ```html
  <button [disabled]="form.invalid" (click)="submit()">Submit</button>
  ```

## When creating custom validators
- Create reusable validator functions:
  ```typescript
  function minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const age = calculateAge(control.value);
      return age >= minAge ? null : { 
        minAge: { required: minAge, actual: age } 
      };
    };
  }
  ```
- Return `null` for valid state
- Return `ValidationErrors` object for invalid state
- Use descriptive error keys

## CRITICAL: Integration with NgRx Signals
- When managing form state in stores:
  - Store form instance in state
  - Track `submitting`, `error` flags
  - Use `rxMethod` for submission
- Reset form after successful submission
- Handle errors and update error state
- EXAMPLE:
  ```typescript
  export const FormStore = signalStore(
    withState({ 
      form: new FormGroup({/* config */}), 
      submitting: false,
      error: null as string | null
    }),
    withMethods((store, service = inject(Service)) => ({
      submit: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { submitting: true, error: null })),
          switchMap(() => service.save(store.form().value)),
          tapResponse({
            next: () => {
              store.form().reset();
              patchState(store, { submitting: false });
            },
            error: (error: Error) => patchState(store, { 
              error: error.message, 
              submitting: false 
            })
          })
        )
      )
    }))
  );
  ```

## When handling form submission
- Validate form before submission
- Set loading/submitting state
- Handle success: reset form, show message
- Handle errors: display error, keep form data
- MUST NOT submit invalid forms

## General
- Use Reactive Forms for complex forms with validation
- Implement validators for all user inputs
- Show validation errors after field is touched
- Disable submit button when form is invalid
- Integrate with NgRx Signals for state management
- Reset forms after successful submission
- Provide clear error messages to users
- Test form validation logic thoroughly
