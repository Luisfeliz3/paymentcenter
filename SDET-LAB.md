# Payment Center SDET lab

This lab combines the Payment Center app from `cardholder-dashboard-refresh` (source commit `54c4588`, with the client lockfile from the working copy) and the standalone Playwright suite. Jenkins builds the React client, starts Express and a fresh MongoDB database on the Mac agent, checks readiness, then gates the build on the API and Google Chrome tests. Each run removes its temporary database. The deployment is a QA environment for that run.

## Run on the Mac

Install Node.js 22 and Google Chrome. Use an executable local `mongod` on PATH, or point to the one on `lefty`.

```sh
bash ci/build.sh
MONGOD_BIN=/Volumes/lefty/mongodb/bin/mongod bash ci/verify.sh
npm run report --prefix qa
```

The scripts build the source in this workspace. Each run uses loopback ports and its own MongoDB directory. The app supplies demo data when a test starts a session. You can also point the existing suite at an approved demo environment with `PAYMENT_CENTER_URL=https://your-qa-host npm test --prefix qa`.

## Run in Jenkins

1. Put this workspace in a Git repository accessible to Jenkins. Install Pipeline, Git, and JUnit in Jenkins.
2. Run the job on the Mac agent. Confirm that the agent user can run Node.js 22, npm, Chrome, and MongoDB. Set the agent PATH so the pipeline can find Node and npm.
3. Create a **Pipeline script from SCM** job and set its script path to `Jenkinsfile`. Run the job with the `MONGOD_BIN` parameter if MongoDB is outside the agent PATH. Use a multibranch job or your repository's Jenkins integration to trigger it on changes.
4. Review **Test Result** for JUnit counts, **Artifacts** for the Playwright HTML report and logs, and the Chrome trace or screenshot on a UI failure. Download the whole HTML report directory to preserve its links.

A failed build, failed readiness check, failed test, or test that passes only after retry blocks a green result. A successful Jenkins build archives the compiled frontend with fingerprints. A persistent staging or production promotion needs a destination and a defined way to start the server with its MongoDB configuration.

## Senior SDET scenarios

| Scenario | Acceptance criteria and evidence | How I would explain the decision |
| --- | --- | --- |
| Concurrent payment retry | Two concurrent payment requests use the same request ID. Verify one posted payment, the expected balance, and no change to the other card. Reusing the request ID with a different amount must return a conflict. See the API payment retry test. | “I test idempotency at the API because a client retry can reach the service after the first request has already committed. A successful response by itself cannot prove we avoided a duplicate charge.” |
| Balance and credit when switching cards | Check the current balance and available credit for both cards and confirm the selected card’s last four digits. See the Chrome card switching test. | “Current balance and statement balance can display the same amount, so I target the specific field and verify the credit calculation separately.” |
| Payment persistence across UI and API | Pay through Chrome, inspect the saved API state in the same session, and reload to confirm the updated dashboard. See the Chrome payment test. | “I assert the user-visible result and the persisted state. That catches a UI that appears to accept the payment even when the backend did not save it.” |
| Invalid input and state integrity | Invalid payments and routes are rejected without altering the portfolio. Pending and duplicate disputes are rejected. See the API validation and dispute tests. | “I check the state after a rejected request. An error response can still hide a partial write.” |
| Session and card isolation | A new session starts with separate demo data, and mutations to one card leave the other card unchanged. See the API session, payments, and preferences tests. | “I isolate sessions so parallel execution is repeatable, and assert the unaffected card explicitly to catch writes to the wrong record.” |
| Release triage | Jenkins keeps JUnit results, service logs, reports, and available traces. A pass on retry still fails the build. | “I use the stage and artifacts to separate startup failures from product regressions. I keep retries for diagnosis and treat a pass on retry as a signal to investigate.” |

For an interview walkthrough, start with duplicate payments as the business risk, show the concurrent requests in the API spec, and connect that evidence to the Jenkins gate. Then open the Chrome payment trace to explain which parts of the same risk need a user-facing test.
