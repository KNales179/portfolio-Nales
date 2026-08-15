# Work System — Decision Record

This is the agreed specification for the **Admin Work / UI Work List system**. This is a permanent backend/database-backed system, **separate from the portfolio content**.

---

## 1. Purpose

The Work system is an internal admin collaboration and project/task tracking system.

It is **not portfolio content** and must not appear as part of the public portfolio.

All authenticated admins can access the Work system.

The system must maintain a complete activity history so admins can see what happened to each Work.

---

# 2. Core hierarchy

```text
Work
│
├── Task
│   ├── Subtask
│   ├── Subtask
│   └── ...
│
├── Task
│   └── ...
│
└── Work Activity
```

Backend models:

```text
Work.js
WorkTask.js
WorkSubtask.js
WorkActivity.js
```

Backend structure:

```text
backend/
├── models/
│   ├── Work.js
│   ├── WorkTask.js
│   ├── WorkSubtask.js
│   └── WorkActivity.js
│
├── controllers/
│   └── workController.js
│
├── routes/
│   └── workRoutes.js
│
└── middleware/
    └── existing authentication/security middleware
```

---

# 3. Work UI

Every Work must contain:

* Work name/title
* Description
* Automatically calculated progress
* Work status
* Creator/owner
* Participants
* Tasks
* Activity history
* Comments/notes
* Links
* Lock state
* Archive state
* Security/access configuration
* Ordering position

### Work progress

Progress is **automatic**.

There is:

> ❌ No manually entered percentage.

Progress is derived from tasks.

The Work percentage is based on **tasks**, regardless of how many subtasks each task contains.

Example:

```text
Work
 ├── Task A → 100%
 ├── Task B → 50%
 └── Task C → 100%

Work = 83%
```

Subtask quantity does **not** give a task additional weight.

---

# 4. Task UI

Every Task contains:

* Title
* Description
* Completion checkbox
* Automatically calculated progress
* Status
* Subtasks
* Ordering position
* Archive state

Tasks may exist **with or without subtasks**.

### Task without subtasks

The task's checkbox directly controls completion.

```text
☐ Implement login
```

Checked:

```text
☑ Implement login
100%
```

### Task with subtasks

Task progress is derived from its subtasks.

```text
Task
 ├── Subtask A ☑
 ├── Subtask B ☑
 └── Subtask C ☐

Task = 66%
```

Rules:

* 100% subtasks → Task completed.
* Reopening a subtask → Task becomes incomplete.
* No manual task percentage.
* No hierarchy-based weighting.

---

# 5. Subtask UI

Subtasks contain:

* Small task title / identifier
* Large subtask title
* Description
* Completion checkbox
* Ordering position
* Archive state
* Activity history through WorkActivity

Subtasks can be reordered by drag-and-drop.

---

# 6. Completion rules

### Work

Work completion is **automatic based on task completion**, but Work completion does **not lock the Work**.

A completed Work can still receive new tasks.

If a new task is added:

```text
Work = COMPLETED
```

automatically becomes:

```text
Work = IN_PROGRESS
```

if the new task makes the calculated progress less than 100%.

Therefore:

> **Completed ≠ Locked**

---

# 7. Work locking

Work has a separate **Lock** feature.

Locking prevents structural changes.

### Locked Work

Allowed:

* Reopen task
* Reopen subtask
* Add comments

Not allowed:

* Complete task
* Complete subtask
* Edit task descriptions
* Add task
* Add subtask
* Delete/archive task
* Delete/archive subtask
* Add links
* Reorder tasks
* Reorder subtasks

The Work creator and Superadmin can unlock the Work.

Participants cannot lock or unlock.

---

# 8. Work ordering

Works can be manually reordered using drag-and-drop.

Only:

* Work creator
* Superadmin

can reorder Works.

There is **no sorting system** based on title/date/etc.

---

# 9. Task/subtask ordering

Tasks and subtasks can be manually reordered using drag-and-drop.

Participants **can reorder tasks/subtasks**.

This is one of their contributor permissions.

---

# 10. Participants

A Work has a participant list containing Admin accounts.

The UI should list all admins and allow authorized users to select participants with checkboxes.

Example:

```text
Participants

☑ Admin A
☐ Admin B
☑ Admin C
☐ Admin D
```

### Who can manage participants?

Work creator:

* Add participants
* Remove participants

Superadmin:

* Add participants
* Remove participants

Participants:

* ❌ Cannot manage participants
* ❌ Cannot remove themselves

---

# 11. Participant permission model

A participant is a **contributor**, not an owner.

Participants can:

* View Work
* Complete tasks
* Reopen tasks
* Complete subtasks
* Reopen subtasks
* Reorder tasks
* Reorder subtasks
* Add comments
* Edit their own comments
* Delete their own comments
* Add links

Participants cannot:

* Edit Work title
* Edit Work description
* Add/remove participants
* Lock Work
* Unlock Work
* Archive Work
* Restore Work
* Delete Work
* Permanently delete Work
* Transfer ownership
* Modify Work permissions
* Change Work security settings

---

# 12. Work creator permissions

Creator can:

* Edit Work
* Manage participants
* Add/remove participants
* Complete/reopen tasks
* Complete/reopen subtasks
* Reorder Work tasks
* Reorder subtasks
* Lock/unlock Work
* Archive Work
* Restore Work
* Transfer ownership
* Change Work permissions
* Manage Work links
* Manage comments according to moderation rules

Creator **cannot permanently delete Work** unless they are also Superadmin.

---

# 13. Superadmin permissions

Superadmin can:

* Edit any Work
* Add/remove any participant
* Unlock any Work
* Archive any Work
* Restore any Work
* Permanently delete Work
* Modify Work ordering
* Modify comments
* Modify links
* Modify tasks/subtasks
* Transfer ownership
* Modify Work permissions
* Modify Work security configuration

Superadmin is effectively the highest Work authority.

---

# 14. Ownership transfer

Ownership can be transferred.

Rules:

* Superadmin can transfer ownership.
* Current creator can transfer ownership.
* Ownership cannot be transferred to a non-admin.
* The new owner receives creator-level Work permissions.

---

# 15. Creator deactivation

If the Work creator's admin account is deactivated:

```text
Creator
   ↓
deactivated
   ↓
Work ownership automatically transfers to Superadmin
```

The Work does **not** become ownerless.

Participants retain their existing editing/contributor access.

Superadmin can later manually transfer ownership to another admin.

---

# 16. Work statuses

Work statuses are formally tracked.

At minimum:

```text
IN_PROGRESS
COMPLETED
LOCKED
ARCHIVED
```

Important:

`COMPLETED` and `LOCKED` are independent concepts.

A Work can be:

```text
COMPLETED + UNLOCKED
```

and therefore still receive new tasks.

Adding an incomplete task automatically causes the Work's calculated progress/status to reflect the new incomplete state.

---

# 17. Task statuses

Tasks have completion state derived from their checkbox/subtasks.

Conceptually:

```text
INCOMPLETE
COMPLETED
ARCHIVED
```

Subtasks follow the same concept.

---

# 18. Task deletion

Tasks are **not immediately destroyed**.

Normal operation:

```text
Task → Archive
```

Subtasks:

```text
Subtask → Archive
```

This preserves the data.

Permanent destruction is reserved for the nuclear Superadmin operation.

---

# 19. Archive system

Works can be archived.

When archived:

* Work disappears from normal Work list.
* Work remains in Archive view.
* Tasks remain untouched.
* Subtasks remain untouched.
* Activity history remains untouched.
* Comments remain.
* Links remain.
* Participants remain.

Archived Work is:

> **Read-only**

while archived.

Cannot:

* Edit Work
* Add tasks
* Add subtasks
* Edit tasks
* Reorder Work
* Reorder tasks
* Modify comments/links through normal Work editing
* Change task state

Restore returns the Work **exactly as it was**.

---

# 20. Permanent deletion

Permanent deletion exists.

It is a **nuclear operation**.

Only:

> **Superadmin + High authentication**

can permanently destroy Work data.

Normal users should never have destructive permanent deletion capabilities.

---

# 21. Security levels

The Work system uses the broader security-level model previously designed for the project.

However:

> **No 2FA is required for normal Work operations.**

The Work system may instead have its own access/security configuration.

Possible Work access modes include:

### Open

Anyone with normal access to the Work system can view it.

### Protected

A Work may require a Work password to access.

### Contributor-enabled

Depending on Work permissions, users may be allowed to actually modify/complete tasks.

This is deliberately flexible.

Not every project needs trusted-device + 2FA insanity. 😂

---

# 22. Work security

A Work can have a password/security requirement.

This is separate from the administrator's normal account authentication.

The goal is to allow different Works to have different sensitivity levels.

For example:

```text
Public/internal Work
→ view freely

Protected Work
→ Work password required

Contributor Work
→ authenticated participants can modify

Highly sensitive Work
→ stronger project-specific access rules if needed
```

The system should not hardcode the assumption that every project requires 2FA/trusted-device authentication.

---

# 23. Comments and notes

Comments are supported.

Comments can:

* Contain text
* @mention other admins
* Be edited
* Be deleted

Notifications for @mentions are planned but **not implemented yet**.

### Comment permissions

Author:

* Edit own comment
* Delete own comment

Superadmin:

* Moderate/edit/delete any comment

Participants cannot modify someone else's comments.

---

# 24. Links

Attachments/files are **not supported for now**.

Instead, Works can contain external links.

Examples:

```text
GitHub repository
Pull request
Documentation
Deployment
Issue tracker
```

Each link contains:

* Title
* URL
* Optional description
* Admin who added it
* Created timestamp
* Updated timestamp

Links can be:

* Edited
* Removed

URL validation is required.

Allowed scheme:

```text
https://
```

Only.

No:

```text
javascript:
data:
file:
http:
```

etc.

> No reason for the Work system to become a tiny malware launcher.

---

# 25. Work Activity

`WorkActivity` is the Work-specific audit/history system.

It is **immutable**.

Once created:

> ❌ Cannot be edited.

> ❌ Cannot be deleted through normal operations.

It records what happened to the Work.

Examples:

```text
Admin created Work

Admin changed task title

Before:
"Implement authentication"

After:
"Implement authentication middleware"
```

Other examples:

```text
Admin added participant

Admin removed participant

Admin completed task

Admin reopened task

Admin completed subtask

Admin reordered task

Admin locked Work

Admin unlocked Work

Admin archived Work

Admin restored Work

Admin added comment

Admin edited comment

Admin deleted comment

Admin added GitHub link

Admin changed GitHub link

Admin removed GitHub link

Admin transferred ownership
```

For changes to data, the activity should preserve:

```text
before
after
```

where appropriate.

Example:

```text
Field:
title

Before:
Implement authentication

After:
Implement authentication middleware
```

---

# 26. Work Activity UI

Every Work should have its activity history **inside the Work UI**.

It is not part of the public portfolio.

Admins can inspect what happened to the Work.

This gives the collaboration system its own traceability.

The separate global Audit Log remains separate.

---

# 27. Global Audit Log vs Work Activity

These are two different systems.

### Global Audit Log

System-wide security/admin auditing.

Examples:

```text
LOGIN
LOGIN_FAILED
LOGOUT
PASSWORD_CHANGE
2FA_ENABLED
2FA_DISABLED
TRUSTED_DEVICE_ADDED
TRUSTED_DEVICE_REMOVED
ADMIN_CREATE
ADMIN_UPDATE
ADMIN_DELETE
...
```

Used for:

> Security monitoring / system-wide audit.

### WorkActivity

Specific Work collaboration history.

Used for:

> "What happened to this Work?"

Do **not** merge the Work system into the public portfolio.

---

# 28. Existing AuditLog model

The current global AuditLog already covers system-level events.

The Work system should not replace it.

Instead, WorkActivity complements it.

Potential Work-related global audit events can still be added to AuditLog where appropriate, but detailed Work history belongs in WorkActivity.

---

# 29. Work UI checklist design

The checklist must use the **same design system as the existing admin UI**.

Do not use browser-default:

```text
☐
☑
```

styling if the application's UI has a custom checkbox design.

The checklist should match:

* colors
* borders
* typography
* hover states
* focus states
* animations
* spacing
* dark/light surface variables

Scrollbar styling must also be consistent with the main application.

Both:

* vertical scrollbar
* horizontal scrollbar

should be styled so they don't look like default browser UI.

---

# 30. Work UI structure

Example:

```text
Work
────────────────────────────────────

Title
Description

Progress: ███████████░░░ 75%

Status: In Progress
Creator: Admin A

Participants
☑ Admin A
☑ Admin B
☐ Admin C

[Lock Work]

────────────────────────────────────

Tasks

☑ Task A
   100%

   ├─ ☑ Subtask A
   └─ ☑ Subtask B

☐ Task B
   50%

   ├─ ☑ Subtask A
   ├─ ☐ Subtask B
   └─ ☐ Subtask C

────────────────────────────────────

Comments

...

Links

GitHub
Documentation

────────────────────────────────────

Activity

Admin changed task title
Admin completed subtask
Admin added GitHub link
...
```

Everything should support drag-and-drop where permitted.

---

# 31. Adding work while already completed

Allowed.

Example:

```text
Work
100%
COMPLETED
UNLOCKED
```

Admin adds:

```text
Task D
```

The Work recalculates:

```text
75%
IN_PROGRESS
```

The Work does **not automatically lock**.

---

# 32. Adding tasks while Work is in progress

Always allowed while the Work is unlocked and the user has permission.

Progress automatically recalculates.

There is no restriction that:

> "You cannot add tasks because the Work is already underway."

---

# 33. Explicit Work completion

Progress is automatic, but the concept of Work completion is explicit.

The system must distinguish:

```text
Progress = 100%
```

from:

```text
Locked = true
```

and should not automatically lock a Work just because it reaches 100%.

---

# 34. No manual progress

Never provide:

```text
Progress: [75%]
```

as an editable field.

Progress comes exclusively from:

```text
Tasks → Subtasks → completion
```

---

# 35. Security philosophy

The overall project follows a principle of:

> **The more destructive or difficult-to-recover an operation is, the stronger the required authorization should be.**

But the security system must remain configurable.

Do not force every project to use:

* 2FA
* trusted devices
* password confirmation
* high authentication

unless the Work's security configuration requires it.

For this Work system specifically:

> Normal Work operations do not require 2FA.

---

# 36. Destructive-operation philosophy

Prefer:

```text
Archive
```

over:

```text
Delete
```

Prefer recoverable state changes.

Permanent deletion is reserved for the highest authority.

Therefore:

```text
Work      → Archive
Task      → Archive
Subtask   → Archive
```

Permanent deletion:

```text
Superadmin + High authentication
```

---

# 37. Permission summary

| Operation            | Normal Admin |             Participant | Creator | Superadmin |
| -------------------- | -----------: | ----------------------: | ------: | ---------: |
| View Work            |            ✅ |                       ✅ |       ✅ |          ✅ |
| Create Work          |            ✅ |                       — |       — |          ✅ |
| Edit Work            |            ❌ |                       ❌ |       ✅ |          ✅ |
| Complete Task        |           ❌* |                       ✅ |       ✅ |          ✅ |
| Reopen Task          |           ❌* |                       ✅ |       ✅ |          ✅ |
| Reorder Tasks        |           ❌* |                       ✅ |       ✅ |          ✅ |
| Add Participant      |            ❌ |                       ❌ |       ✅ |          ✅ |
| Remove Participant   |            ❌ |                       ❌ |       ✅ |          ✅ |
| Lock Work            |            ❌ |                       ❌ |       ✅ |          ✅ |
| Unlock Work          |            ❌ |                       ❌ |       ✅ |          ✅ |
| Archive Work         |            ❌ |                       ❌ |       ✅ |          ✅ |
| Restore Work         |            ❌ |                       ❌ |       ✅ |          ✅ |
| Transfer Ownership   |            ❌ |                       ❌ |       ✅ |          ✅ |
| Permanently Delete   |            ❌ |                       ❌ |       ❌ |          ✅ |
| Add Comment          |           ❌* |                       ✅ |       ✅ |          ✅ |
| Edit Own Comment     |           ❌* |                       ✅ |       ✅ |          ✅ |
| Delete Own Comment   |           ❌* |                       ✅ |       ✅ |          ✅ |
| Moderate Any Comment |            ❌ |                       ❌ |       ❌ |          ✅ |
| Add Link             |           ❌* |                       ✅ |       ✅ |          ✅ |
| Edit Link            |           ❌* | contributor/owner rules |       ✅ |          ✅ |
| Remove Link          |           ❌* | contributor/owner rules |       ✅ |          ✅ |
| Reorder Work         |            ❌ |                       ❌ |       ❌ |          ✅ |

`*` means dependent on the Work's configured access/participation model.

---

# 38. Important design principle

The system should be **permission-driven rather than hardcoded around one specific project**.

That means future Works can define different access behavior without rebuilding the entire Work system.

---

# 39. Current backend implementation status

Already created:

```text
backend/models/Work.js
backend/models/WorkTask.js
backend/models/WorkSubtask.js
backend/models/WorkActivity.js
backend/controllers/workController.js
backend/routes/workRoutes.js
```

Existing authentication middleware uses:

```text
JWT
+
AdminSession
+
session revocation
+
session expiration
+
Admin tokenVersion
+
Admin status
```

Therefore Work routes should use the existing authentication/security infrastructure rather than creating another authentication system unnecessarily.

---

# 40. Existing authentication behavior

Current `protect` middleware verifies:

1. Bearer token exists.
2. JWT is valid.
3. `sessionId` exists.
4. `AdminSession` exists.
5. Session isn't revoked.
6. Session hasn't expired.
7. Admin exists.
8. JWT `tokenVersion` matches Admin `tokenVersion`.
9. Admin is ACTIVE.
10. Session `lastUsedAt` is updated.

Then:

```js
req.user = admin;
req.session = session;
```

Work authorization should build on this.

---

# 41. What remains to implement

The specification is agreed. Implementation can proceed in this order:

### Backend

* Finalize Work schema
* Finalize Task schema
* Finalize Subtask schema
* Finalize immutable WorkActivity schema
* Work controller
* Work routes
* Permission middleware/helpers
* Participant management
* Progress calculation
* Lock handling
* Archive/restore
* Task/subtask archive
* Ownership transfer
* Comment system
* Link system
* Work security/access system
* Activity generation
* Ordering/reordering endpoints

### Frontend

* Work list
* Work creation
* Work detail page
* Work editing
* Participant manager
* Task UI
* Subtask UI
* Drag-and-drop ordering
* Automatic progress
* Lock UI
* Archive UI
* Restore UI
* Comments
* Links
* Activity timeline
* Permission-aware controls
* Styled scrollbars
* Custom checklist UI

### Later

* @mention notifications
* Additional security controls
* More sophisticated contribution monitoring
* Contribution-quality analysis

---

## Final rule to remember

The Work system is essentially:

> **A recoverable, collaborative, permission-controlled admin project system with automatic progress and an immutable history.**

The important distinction is:

```text
Progress ≠ Completion ≠ Lock ≠ Archive
```

and:

```text
Participant = Contributor
Creator = Work Owner
Superadmin = Ultimate Authority
WorkActivity = Immutable History
AuditLog = Global Security/System History
```

That is the current **source of truth** for the Work System decisions.
