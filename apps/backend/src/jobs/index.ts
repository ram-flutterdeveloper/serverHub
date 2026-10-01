import cron from "node-cron";

import {
    expireProviderAssignments,
} from "./expire-provider-assignments.job";


export const startJobs = () => {

    cron.schedule("* * * * *", async () => {

        console.log(
            "⏰ Checking expired provider assignments..."
        );

        await expireProviderAssignments();

    });

    console.log(
        "✅ Background jobs started"
    );
};