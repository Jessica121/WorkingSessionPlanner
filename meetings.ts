import { internals } from "rx-core";

export class Meeting {
    protected duration: number;
    protected startTime?: Date;
    protected endTime?: Date;
    protected link?: string;
    protected title: string;
    protected author: string;     // TODO: a class ?
    protected meetingId: string;      // TODO: format? 
    protected sessionId: string; 

    public constructor(duration: number, title: string, author: string, meetingId: string, sessionId: string) {
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