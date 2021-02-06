import { Meeting } from "./meetings";
import { Queue } from 'queue-typescript';
export class Session {
    protected meetings = new Queue<Meeting>();
    protected hasHappened = false;
    protected sessionId: number;
    protected dateTime: Date;
    protected currentDuration: number;
    protected expectedDuration: number;
    protected maxDurationOverflow: number;

    constructor(sessionId: number, dateTime: Date, expectedDuration: number, maxDurationOverflow: number) {
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
     */
    public removeMeetingById(id: number) {
        for (let meeting of this.meetings) {
            if (meeting.getMeetingId() == id) {
                this.meetings.remove(meeting);
                return;
            }
        }
        console.error("Remove meeting by id: such meeting not found with id: ", id);
    }

    /**
     * removeLastMeeting
     */
    public removeLastMeeting() {
        if (this.meetings.length > 0) {
            this.meetings.dequeue();
        } else {
            throw console.error("Cannot remove meetings from an empty session queue.");
        }
    }

    public editMeetingById(id: number, newMeeting: Meeting) {
        for (let meeting of this.meetings) {
            if (meeting.getMeetingId() == id) {
                this.meetings.insert(newMeeting, meeting, true);
                return;
            }
        }
        console.error("Edit meeting by id: such meeting not found with id: ", id);
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