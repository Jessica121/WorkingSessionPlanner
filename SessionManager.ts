import { Session } from "./Sessions";
import { Meeting } from "./meetings";

export class SessionManager {
    meetingSessions = new Array<Session>();
    expectedSessionDuration: number;
    maxDurationOverflow = 0;
    lastSessionIndex = -1;

    constructor(expectedSessDuration: number, maxDurationOverflow: number) {
        this.expectedSessionDuration = expectedSessDuration;
        this.maxDurationOverflow = maxDurationOverflow;
    }

    public addMeetingToTheLastSession(meeting: Meeting, createNewSession = false): boolean {
        if (this.lastSessionIndex == -1 || createNewSession) {
            this.generateNewSession();
        }

        if (this.lastSessionIndex < 0) {
            console.error("adding meeting to a nil session");
            return false;
        }

        let lastSession = this.meetingSessions[this.lastSessionIndex];
        let meetingFitFirstAttempt = lastSession.appendMeeting(meeting);

        // Too long meeting prohibited: If the session is empty and the meeting cannot fit, stop right there cuz its never gonna fit.
        if (!meetingFitFirstAttempt && lastSession.meetingCount() == 0) {
            console.error("Add meeting: meeting is too big to fit into any session, meeting info: ", meeting);
            return false;
        }

        // Try to create a new empty session and add meeting to there
        this.generateNewSession();
        let meetingFitSecondAttempt = this.meetingSessions[this.lastSessionIndex].appendMeeting(meeting);
        
        if (!meetingFitSecondAttempt) {
            console.error("Adding meeting to an empty session failed. The meeting length should be within reasonable value. This is not expected. Meeting details: ", meeting);
            return false;
        }

        return true;
    }

    // Force adding a meeting to the top of the session and shift the rest.
    public addMeetingToSessionByIndex(index: number, meeting: Meeting) {
        if(this.sessionIdexOutOfBounds(index)) {
            console.error("Add meeting to session index out of bounds, index: ", index);
        }
        this.meetingSessions[index].forcePrependMeeting(meeting);
        this.shiftIfNecessaryFromSessionIndex(index);
    }

    // TODO add meeting into previous session if has enough space.

    private generateNewSession() {
        let sessionId = Math.random();
        let date = new Date();
        let session = new Session(sessionId, date, this.expectedSessionDuration, this.maxDurationOverflow);
        this.meetingSessions.push(session);
        this.lastSessionIndex = this.meetingSessions.length - 1;
    }

    public removeMeetingBy(sessionId: number, meetingId: number) {
        for (let i = 0; i < this.meetingSessions.length; i++) {
            let session = this.meetingSessions[i];
            if (session.getSessionId() == sessionId) {
                session.removeMeetingById(meetingId);
                this.shiftIfNecessaryFromSessionIndex(i);
                return;
            }
        }

        console.error("Remove meeting by session Id: no such session exists with id: ", sessionId);
    }

    public editMeetingBy(sessionId: number, meetingId: number, newMeeting: Meeting) {
        for (let i = 0; i < this.meetingSessions.length; i++) {
            let session = this.meetingSessions[i];
            if (session.getSessionId() == sessionId) {
                let editSucceed = session.editMeetingById(meetingId, newMeeting);
                if (!editSucceed) {
                    if (i == this.lastSessionIndex) {
                        this.addMeetingToTheLastSession(newMeeting, true);
                     } else {
                        this.addMeetingToSessionByIndex(i + 1, newMeeting);
                     }
                }
                this.shiftIfNecessaryFromSessionIndex(i);
                return;
            }
        }

        console.error("Edit meeting by session Id: no such session exists with id: ", sessionId);
    }

    public shiftIfNecessaryFromSessionIndex(index: number) {
        // Recursion stops when the index is out of bounds.
        if (this.sessionIdexOutOfBounds(index)) {
            return;
        }

        let nextIndex = index + 1;
        // if its already the last session, check for capacity and add a new session if not fit.
        if (index == this.lastSessionIndex) {
            let lastSession = this.meetingSessions[this.lastSessionIndex];
            while (lastSession.exceedsCapacity()) {
                let lastMeeting = lastSession.removeLastMeeting()
                this.addMeetingToTheLastSession(lastMeeting);
            }
        } else {
            // If the shifting point is at the middle, then two cases, 
            // 1. this session has extra space to shift meetings from the next session,
            // 2. this session exceeds capacity and need to shift its load onto the next session.
            let curSession = this.meetingSessions[index];
            let nextSession = this.meetingSessions[index + 1];
            while(!curSession.exceedsCapacity()) {
                curSession.appendMeeting(nextSession.removeFirstMeeting());
            }

            while(curSession.exceedsCapacity()) {
                nextSession.forcePrependMeeting(curSession.removeLastMeeting());
            }
        }
        
        // Recursively shift next session.
        this.shiftIfNecessaryFromSessionIndex(nextIndex);
    }

    private sessionIdexOutOfBounds(index: number): boolean {
        return index < 0 || index > this.lastSessionIndex
    }
}