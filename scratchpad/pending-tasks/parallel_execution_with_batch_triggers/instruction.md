Developers migrating to Trigger.dev V4 often attempt to use standard `Promise.all([task.triggerAndWait()])` for concurrent tasks, which is unsupported and throws an error.

You need to implement a `process-gallery` task that receives an array of 5 image URLs and processes them concurrently by triggering a `resize-image` sub-task for each URL simultaneously. 

**Constraints:**
- Strictly DO NOT use `Promise.all()` for orchestration.
- You must use `batch.triggerByTaskAndWait` to execute the sub-tasks in parallel.
- The parent task must return an array of all successfully resized image URLs.