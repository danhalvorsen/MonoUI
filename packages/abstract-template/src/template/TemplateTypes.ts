/** Støttede template‑typer */
export enum TemplateType {
    Text = "text",       // For feilmeldinger, UI-tekster
    Code = "code",       // For kodegenerering (C#, TS, JSON, DSL)
    Property = "property" // For runtime‑substitusjon (f.eks. {PropertyName}, {Value})
}