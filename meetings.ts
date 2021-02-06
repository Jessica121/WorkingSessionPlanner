export class Meeting {
    protected duration: number;
    protected startTime?: Date;
    protected endTime?: Date;
    protected link?: string;
    protected title: string;
    protected author: string;     // TODO: a class ?
    protected meetingId: number;
    protected sessionId: number; 

    public constructor(duration: number, title: string, author: string, meetingId: number, sessionId: number) {
        this.duration = duration;
        this.title = title;
        this.author = author;
        this.meetingId = meetingId;
        this.sessionId = sessionId;
    }

    public getDuration() {
        return this.duration;
    }

    public getTitle() {
        return this.title;
    }

    public getDAuthor() {
        return this.author;
    }

    public getMeetingId() {
        return this.meetingId;
    }
    
    public getSessionId() {
        return this.sessionId;
    }

}