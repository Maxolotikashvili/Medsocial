import { FormGroup } from "@angular/forms";

export class FormUtils {
    static setServerErrors(form: FormGroup, serverErrorrs: Record<string, string[]>): void {
        Object.keys(serverErrorrs).forEach((key) => {
            const control = form.get(key);
            if (control) {
                control.setErrors({
                    serverError: serverErrorrs[key][0]
                });
                control.markAsTouched();
            }
        })
    }
}