import { Meeting } from "./meetings";
import { Queue } from 'queue-typescript';
export class Session {
    protected meetings = new Queue<Meeting>();
    protected hasHappened = false;
    protected sessionId: number;
    protected dateTime: Date;
    // Todo meeting interval
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

    public exceedsCapacity(meeting: Meeting = null): boolean {
        let meetingDuration = meeting == null ? 0 : meeting.getDuration();
        return this.currentDuration + meetingDuration <= this.expectedDuration + this.maxDurationOverflow;
    }

    /**
     * addMeeting
     * add to meeting if there is enough space
     * aka. the current duration of meetings plus this meeting's duration does not exceed the expected duration plus the max overflow time 
     * if so, return true, else return false. 
     */
    public appendMeeting(meeting: Meeting): boolean {
        // If this session cannot fit this meeting, return false, and let session manager deal with shifting.
        if (!this.exceedsCapacity(meeting)) {
            return false;
        }

        let succeed = this.meetings.append(meeting);
        if (succeed) {
            this.currentDuration += meeting.getDuration();
            return true;
        }

        console.error("Append meeting append failed, meeting info: ", meeting);
        
        return false;
    }

    // Add meeting to head regardlessly, don't check for fitness and let the manager deal with shifting.
    public forcePrependMeeting(meeting: Meeting) {
        let succeed = this.meetings.prepend(meeting);
        if (!succeed) {
            console.error("forcePrependMeeting failed, meeting info: ", meeting);
        }
    }

    /**
     * removeMeetingById
     */
    public removeMeetingById(id: number) {
        for (let meeting of this.meetings) {
            if (meeting.getMeetingId() == id) {
                this.meetings.remove(meeting);
                this.currentDuration -= meeting.getDuration();
                return;
            }
        }
        console.error("Remove meeting by id: such meeting not found with id: ", id);
    }

    /**
     * removeLastMeeting
     */
    public removeLastMeeting(): Meeting {
        if (this.meetings.length > 0) {
            let lastMtg = this.meetings.dequeue();
            this.currentDuration -= lastMtg.getDuration();
            return lastMtg;
        } else {
            throw console.error("Cannot remove meetings from an empty session queue.");
        }
    }

    /**
     * removeFirstMeeting
     */
    public removeFirstMeeting(): Meeting {
        if (this.meetings.length > 0) {
            let firstMtg = this.meetings.removeHead();
            this.currentDuration -= firstMtg.getDuration();
            return firstMtg;
        } else {
            throw console.error("Cannot remove meetings from an empty session queue.");
        }
    }

    public editMeetingById(id: number, newMeeting: Meeting): boolean {
        for (let meeting of this.meetings) {
            if (meeting.getMeetingId() == id) {
                let editInQueueSucceed = this.meetings.insert(newMeeting, meeting, true);
                if (editInQueueSucceed) {
                    this.currentDuration -= meeting.getDuration();
                    if (!this.exceedsCapacity(newMeeting)) {
                        this.meetings.remove(newMeeting);
                        console.error("Edit meeting, the new meeting cannot fit into this session: ", newMeeting);
                        return false;
                    }
                    this.currentDuration += newMeeting.getDuration();
                    return true;
                }
            }
        }

        console.error("Edit meeting by id: such meeting not found with id: ", id);
        return false;
    }

    public getMeetings() {
        return this.meetings;
    }

    public meetingCount() {
        return this.meetings.length;
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