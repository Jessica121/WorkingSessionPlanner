import { Session } from "./Sessions";
import { Meeting } from "./meetings";

export class SessionManager {
    meetingSessions = new Array<Session>();
    expectedSessionDuration: number;
    maxDurationOverflow = 0;

    constructor(expectedSessDuration: number, maxDurationOverflow: number) {
        this.expectedSessionDuration = expectedSessDuration;
        this.maxDurationOverflow = maxDurationOverflow;
    }

    public addMeeting(meeting: Meeting) {
        if (this.meetingSessions.length == 0) {
            let sessionId = Math.random();
            let date = new Date();
            let session = new Session(sessionId, date, this.expectedSessionDuration, this.maxDurationOverflow);
            this.meetingSessions.push(session);
        }
        let lastIndex = this.meetingSessions.length - 1;
        if (lastIndex < 0) {
            console.error("adding meeting to a nil session");
        } else {
            this.meetingSessions[lastIndex].addMeeting(meeting);
        }
    }

    public removeMeetingBy(sessionId: number, meetingId: number) {
        for (let session of this.meetingSessions) {
            if (session.getSessionId() == sessionId) {
                session.removeMeetingById(meetingId);
                return;
            }
        }

        console.error("Remove meeting by session Id: no such session exists with id: ", sessionId);

        // TODO: Shift if necessary
    }

    public editMeetingBy(sessionId: number, meetingId: number, newMeeting: Meeting) {
        for (let session of this.meetingSessions) {
            if (session.getSessionId() == sessionId) {
                session.editMeetingById(meetingId, newMeeting);
                return;
            }
        }

        console.error("Edit meeting by session Id: no such session exists with id: ", sessionId);

        // TODO: Shift if necessary
    }

    
}