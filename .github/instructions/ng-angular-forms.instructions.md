---
description: 'Angular Reactive Forms with validation and NgRx Signals integration'
applyTo: '**/*form*.ts, **/*form*.html'
---

# Angular Forms Development Guidelines

## Reactive Forms

```typescript
userForm = new FormGroup({
  name: new FormControl('', [Validators.required]),
  email: new FormControl('', [Validators.required, Validators.email]),
  age: new FormControl(null, [Validators.min(18)])
});
```

## Custom Validators

```typescript
function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = calculateAge(control.value);
    return age >= minAge ? null : { minAge: { required: minAge, actual: age } };
  };
}
```

## Integration with NgRx Signals

```typescript
export const FormStore = signalStore(
  withState({ form: new FormGroup({/*...*/}), submitting: false }),
  withMethods((store, service = inject(Service)) => ({
    submit: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { submitting: true })),
        switchMap(() => service.save(store.form().value)),
        tapResponse({
          next: () => {
            store.form().reset();
            patchState(store, { submitting: false });
          },
          error: (error) => patchState(store, { error: error.message, submitting: false })
        })
      )
    )
  }))
);
```

## Best Practices

- ✅ Use FormControl, FormGroup, FormArray
- ✅ Implement validators for all inputs
- ✅ Show validation errors after touched
- ✅ Disable submit when form invalid
- ❌ Don't use template-driven forms for complex forms
- ❌ Don't forget to reset forms after submission
