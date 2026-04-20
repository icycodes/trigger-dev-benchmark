Many enterprise workflows require explicit human approval (like sending an email campaign or processing a refund) before proceeding with the rest of the automation, without blocking compute resources.

You need to create an `email-campaign` task that generates a draft, halts execution entirely to wait for an external user approval, and then proceeds to send the email only after the approval is received. 

**Constraints:**
- Must use the `wait.forToken("approval-token")` primitive to pause the workflow.
- Do not use `wait.for` (time-based) or `wait.until` (date-based).
- The task must extract the approval payload returned by the token resolution and include it in its final return statement.