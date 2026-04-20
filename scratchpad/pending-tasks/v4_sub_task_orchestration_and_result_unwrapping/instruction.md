In Trigger.dev V4, the `triggerAndWait` method no longer returns the raw execution data directly; it returns a `Result` object to safely handle success and failure states of sub-tasks.

You need to write a parent task called `generate-invoice` that invokes a child task named `calculate-tax` using `triggerAndWait()`. The parent task must successfully extract the tax data from the child task's output to calculate and return the total invoice sum.

**Constraints:**
- Must explicitly use the `await` keyword on the `triggerAndWait()` call.
- You must extract the sub-task's payload by calling `.unwrap()` on the returned Result object or explicitly checking the `.ok` property.
- Do not assume the payload is directly available on the awaited object.