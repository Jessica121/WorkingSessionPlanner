import { Meeting } from "./meetings";

export class Session {
    protected meetings = new Queue<Meeting>();
    protected hasHappened = false;
    protected sessionId: string;
    protected dateTime: Date;
    protected currentDuration: number;
    protected expectedDuration: number;
    protected maxDurationOverflow: number;

    constructor(sessionId: string, dateTime: Date, expectedDuration: number, maxDurationOverflow: number) {
        this.sessionId = sessionId;
        this.dateTime = dateTime;
        this.expectedDuration = expectedDuration;
        this.maxDurationOverflow = maxDurationOverflow;
    }

    public setHasHappened(hasHappened: boolean) {
        this.hasHappened = hasHappened;
    }

    /**
     * addMeeting
     * add to meeting if there is enough space
     * aka. the current duration of meetings plus this meeting's duration does not exceed the expected duration plus the max overflow time 
     * if so, return true, else return false. 
     */
    public addMeeting(meeting: Meeting): boolean {
        if (this.currentDuration + meeting.getDuration() > this.expectedDuration + this.maxDurationOverflow) {
            // Session manager should be able to manage this. for e.g. add this meeting to the next queue, etc.
            return false;
        }
        this.meetings.enqueue(meeting);
        this.currentDuration += meeting.getDuration();
        return true;
    }

    /**
     * removeMeetingById
     * TODO 
     * the queue does not have iteration ...
     */
    public removeMeetingById(id: string) {

    }

    /**
     * removeLastMeeting
     */
    public removeLastMeeting() {
        if (this.meetings.size() > 0) {
            this.meetings.dequeue();
        } else {
            throw console.error("Cannot remove meetings from an empty session queue!");
        }
    }

    public getMeetings() {
        return this.meetings;
    }

    public getHasHappened() {
        return this.hasHappened;
    }


    public getSessionId() {
        return this.sessionId;
    }

    public getDateTime() {
        return this.dateTime;
    }

    public getExpectedDuration() {
        return this.expectedDuration;
    }

    public getMaxDurationOverflow() {
        return this.maxDurationOverflow;
    }
}