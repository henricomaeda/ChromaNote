// Creates and exports an Note class.
export class Note {
    constructor(name, note, createdDate, checklist) {
        this.name = name.trim();
        this.note = note.trim();
        this.createdDate = createdDate;
        this.checklist = checklist;
    }
}
