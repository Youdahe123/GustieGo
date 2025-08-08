import mongoose from "mongoose";
import Shift from "../models/shifts.js";
import weekStates from "../models/weeklyAnalytics.js";


async function autoCompleteShifts(){
    const now = new Date()
    const shifts = await Shift.find({
        endTime : {$lt : now},
       'studentDetails.status':'claimed'
    })

    for (const shift of shifts){
        let updated = false
        for (const detail of shift.studentDetails){
            if (detail.status === 'claimed'){
                detail.status = 'completed' // looks for ones that are claimed and past the current time and checks every n times
                updated = true
            }
        }
        if(updated){
            await shift.save()
        }
    }

}

async function fillWeekStats({ weekStart, weekEnd }) {
    // Find all shifts in the week
    const shifts = await Shift.find({
        startTime: { $gte: weekStart, $lt: weekEnd }
    });

    // Map to store stats per student
    const stats = {};

    for (const shift of shifts) {
        for (const detail of shift.studentDetails) {
            const id = detail.studentId.toString();
            if (!stats[id]) {
                stats[id] = {
                    completedShifts: 0,
                    absentShifts: 0,
                    transferredShifts: 0,
                    totalHours: 0
                };
            }
            if (detail.status === "completed") {
                stats[id].completedShifts += 1;
                // Calculate hours for completed shifts
                if (shift.startTime && shift.endTime) {
                    const hours = (shift.endTime - shift.startTime) / (1000 * 60 * 60);
                    stats[id].totalHours += hours;
                }
            }
            if (detail.status === "absent") stats[id].absentShifts += 1;
            if (detail.status === "transferred") stats[id].transferredShifts += 1;
        }
    }

    // Save or update stats in DB
    for (const [studentId, data] of Object.entries(stats)) {
        await weekStates.findOneAndUpdate(
            { studentId, weekOf: weekStart },
            { ...data, studentId, weekOf: weekStart },
            { upsert: true }
        );
    }
}


export {autoCompleteShifts,fillWeekStats}