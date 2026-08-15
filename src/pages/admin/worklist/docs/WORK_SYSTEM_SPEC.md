# Work System — Master Specification

> **Status:** Active project specification
> **Purpose:** Permanent source of truth for the admin Work/Task/Subtask system.
> **Scope:** Backend, database, API, security, permissions, UI, activity history, lifecycle, and future extensions.

---

# 1. PROJECT CONTEXT

The Work system is a permanent internal administrative workspace for managing development/project work.

It is **NOT part of the public portfolio**.

The portfolio remains the visitor-facing product.

The Work system exists for administrators to:

* Organize development work.
* Break work into tasks and subtasks.
* Track progress.
* Collaborate with other administrators.
* Reorder work manually.
* Comment on work.
* Attach external links such as GitHub repositories/issues.
* See detailed history of changes.
* Preserve history instead of destroying data.

All authenticated admins can access the Work system.

The Work system is database-backed and permanent.

It is **not a temporary hardcoded checklist**.

---

# 2. CORE DESIGN PHILOSOPHY

The Work system follows these principles:

1. **Do not destroy data unnecessarily.**
2. Prefer archive/restore over deletion.
3. Permanent destruction is exceptional.
4. History must remain available.
5. WorkActivity is immutable.
6. Progress is automatic.
7. No manually entered progress percentages.
8. Completion and locking are separate concepts.
9. Contributors are not owners.
10. Ownership and permissions are explicit.
11. Normal collaboration should be easy.
12. Destructive operations should require stronger authorization.
13. Security should remain flexible.
14. The Work system must not assume every project uses 2FA or trusted devices.
15. The system should be reusable for projects with different security requirements.

---

# 3. WORK HIERARCHY

The primary hierarchy is:

```text
Work
├── Task
│   ├── Subtask
│   ├── Subtask
│   └── ...
├── Task
│   ├── Subtask
│   └── ...
├── Participants
├── Comments / Notes
├── Links
└── WorkActivity
```

There is no requirement that every Task have Subtasks.

A Work may contain:

* Tasks with no Subtasks.
* Tasks with Subtasks.
* A mixture of both.

---

# 4. WORK

A Work represents a larger unit of development/project activity.

Example:

```text
Work:
Authentication & Security System
```

A Work contains at minimum:

* Title/name
* Description
* Tasks
* Participants
* Creator/owner
* Progress
* Status
* Lock state
* Archive state
* Comments/notes
* Links
* Activity history
* Ordering information
* Security/access configuration where applicable

---

# 5. WORK UI

The original UI concept requires a Work checklist interface.

Each Work should visually contain:

```text
Work title
Work description
Progress bar

Task
Task description
Task progress
Checkbox / task state

    Subtask
    Subtask description
    Checkbox

Task
Task description
Task progress

Activity / history
Comments / notes
Links
Participants
```

The UI must support drag-and-drop ordering.

There is intentionally **no automatic sorting requirement**.

---

# 6. WORK PROGRESS

Progress is automatically calculated.

There is **NO manual percentage field controlled by the user**.

The percentage displayed by the UI must be derived from completion state.

The Work's progress is based on **Tasks**, not the total number of Subtasks.

Example:

```text
Work

Task A = 100%
Task B = 50%

Work = 75%
```

Subtask count does not give a Task additional weight.

Therefore:

```text
Task A
├── 10 subtasks

Task B
└── 1 subtask
```

does NOT mean Task A is worth 10x Task B.

Each Task contributes equally to Work progress.

---

# 7. TASK WITHOUT SUBTASKS

A Task may exist without Subtasks.

Example:

```text
[ ] Implement authentication middleware
```

The Task checkbox directly controls completion.

```text
unchecked → incomplete
checked   → complete
```

The Task therefore contributes:

```text
0%
```

or

```text
100%
```

to Work progress.

---

# 8. TASK WITH SUBTASKS

When a Task has Subtasks, its progress is derived from its Subtasks.

Example:

```text
Task A

[x] Subtask 1
[x] Subtask 2
[ ] Subtask 3
```

Task progress:

```text
66.67%
```

Rules:

1. 100% Subtasks → Task becomes completed.
2. Reopening a Subtask → Task becomes incomplete.
3. No manual Task percentage.
4. Subtask completion controls Task completion.
5. Subtasks do not change the Work weighting of the Task.

---

# 9. TASK/SUBTASK CHECKBOX RULE

The checkbox is the actual completion mechanism.

There is no separate manually-entered percentage.

The system calculates:

```text
Subtask → completion state

Task with no subtasks → checkbox

Task with subtasks → subtask completion

Work → task completion
```

---

# 10. ADDING NEW WORK

Work is not frozen simply because it reaches 100%.

A completed Work can still receive new Tasks.

Example:

```text
Work
Progress: 100%
Status: COMPLETED
Unlocked
```

A new incomplete Task is added:

```text
Work
Progress: 75%
Status: IN_PROGRESS
```

Therefore:

> **Completed does NOT mean locked.**

---

# 11. WORK COMPLETION

Work completion is explicit at the conceptual/status level, while its percentage remains automatic.

The Work can become:

```text
IN_PROGRESS
```

or:

```text
COMPLETED
```

Completion does not automatically lock the Work.

---

# 12. WORK LOCK

Locking is separate from completion.

A Work can be:

```text
Completed + unlocked
Completed + locked

In progress + unlocked
In progress + locked
```

Locking prevents additional Work modification.

## Locked Work allows:

* Reopen Task
* Reopen Subtask
* Add comments

## Locked Work does not allow:

* Complete Task
* Complete Subtask
* Edit Task descriptions
* Add Task
* Add Subtask
* Add links
* Delete/archive Task
* Delete/archive Subtask
* Reorder existing Tasks

Only:

* Work creator/owner
* Superadmin

can lock or unlock a Work.

Participants cannot lock or unlock Work.

---

# 13. WORK ARCHIVE

Archive is the normal destructive-prevention mechanism.

Archived Work:

* Disappears from the normal Work list.
* Remains in Archive view.
* Keeps Tasks.
* Keeps Subtasks.
* Keeps Activity history.
* Keeps Comments.
* Keeps Links.
* Keeps Participants.
* Keeps configuration.

Archived Work is read-only.

---

# 14. ARCHIVED WORK RULES

While archived:

* Cannot edit Work.
* Cannot add Tasks.
* Cannot add Subtasks.
* Cannot modify Tasks.
* Cannot modify Subtasks.
* Cannot reorder Work.
* Cannot reorder Tasks.
* Cannot add Comments through normal Work editing.
* Cannot add Links.

The data remains intact.

---

# 15. RESTORE

Restoring a Work returns it to the state it had before archival.

Restore does not reconstruct the Work from scratch.

The original:

* Tasks
* Subtasks
* Participants
* Comments
* Links
* Activity history
* Ordering
* Configuration
* Progress state

remain preserved.

---

# 16. TASK ARCHIVE

Tasks should not normally be permanently deleted.

Normal Task removal uses archive.

Archived Tasks retain their historical information.

The system should preserve:

* Task data
* Subtasks
* Activity
* Comments
* Links
* Metadata

Permanent destruction is reserved for the highest-level destructive operation.

---

# 17. SUBTASK ARCHIVE

Subtasks follow the same philosophy.

Normal removal = archive.

Permanent destruction = exceptional/high-security operation.

---

# 18. PARTICIPANTS

Participants are contributors.

They are NOT owners.

The Work creator and Superadmin can manage participants.

The participant UI should list all admins and allow selection.

Example:

```text
Participants

[x] Admin A
[x] Admin B
[ ] Admin C
[x] Admin D
[ ] Admin E
```

Selected admins become Work participants.

---

# 19. PARTICIPANT PERMISSIONS

Participants can:

* View Work.
* Complete Tasks when Work is unlocked.
* Reopen Tasks.
* Complete Subtasks when Work is unlocked.
* Reopen Subtasks.
* Reorder Tasks.
* Comment.
* Edit their own comments.
* Delete their own comments.
* Add links.
* Edit/remove links according to link permissions.

Participants cannot:

* Edit Work title.
* Edit Work description.
* Add participants.
* Remove participants.
* Lock Work.
* Unlock Work.
* Archive Work.
* Restore Work.
* Transfer ownership.
* Change Work permissions.
* Perform elevated/destructive Work management.

---

# 20. WORK CREATOR / OWNER

The creator is initially the Work owner.

The owner can:

* Edit Work title.
* Edit Work description.
* Manage participants.
* Remove participants.
* Lock Work.
* Unlock Work.
* Archive Work.
* Restore Work.
* Transfer ownership.
* Change Work permissions.
* Reorder Work.
* Manage Work structure.

The creator is still subject to global Superadmin authority.

---

# 21. SUPERADMIN

Superadmin has global Work authority.

Superadmin can:

* Edit any Work.
* Add participants.
* Remove participants.
* Lock any Work.
* Unlock any Work.
* Archive any Work.
* Restore any Work.
* Permanently delete Work.
* Reorder Work.
* Modify/moderate comments.
* Modify/remove links.
* Transfer ownership.
* Change Work permissions.
* Override normal Work restrictions.

---

# 22. PARTICIPANT vs CREATOR vs SUPERADMIN

Conceptual hierarchy:

```text
Superadmin
    ↓
Work Creator / Owner
    ↓
Participant / Contributor
```

A Participant contributes to Work.

The Creator manages their Work.

Superadmin manages the entire Work system.

---

# 23. OWNERSHIP TRANSFER

Work ownership can be transferred.

Rules:

* Creator can transfer ownership.
* Superadmin can transfer ownership.
* Ownership cannot remain permanently ownerless.
* New owner receives creator-level Work management permissions.

---

# 24. CREATOR DEACTIVATION

If the Work creator is deactivated:

1. Work ownership automatically transfers to Superadmin.
2. Work does not become ownerless.
3. Existing participants retain their contributor permissions.
4. Superadmin can later manually transfer ownership to another admin.

---

# 25. PARTICIPANT SELF-REMOVAL

Participants cannot remove themselves.

If someone should no longer participate:

* Creator removes them.
* Superadmin removes them.

Creator cannot simply remove themselves as owner.

They must transfer ownership if ownership needs to change.

---

# 26. WORK ORDERING

Works are manually ordered.

There is no automatic sorting requirement.

Only:

* Superadmin
* Appropriate Work owner/creator

can reorder Works.

Work ordering changes should be logged.

---

# 27. TASK ORDERING

Tasks can be manually reordered.

Participants are allowed to reorder Tasks.

Work creator/owner can reorder Tasks.

Superadmin can reorder Tasks globally.

Ordering is intentional and persistent.

---

# 28. SUBTASK ORDERING

Subtasks can also be manually reordered.

No automatic sorting.

The ordering must be stored persistently.

---

# 29. COMMENTS / NOTES

Comments and notes are part of the Work system.

Admins can:

* Create comments.
* Edit their own comments.
* Delete their own comments.

Superadmin can:

* Edit/moderate any comment.
* Delete/moderate any comment.

Comments may eventually support:

```text
@AdminName
```

mentions.

Mention notifications are **future functionality**.

They are not part of the first implementation.

---

# 30. LINKS

External links are allowed.

Examples:

* GitHub
* GitLab
* Documentation
* Deployment
* Issue tracker
* API documentation

Links contain:

* Title
* URL
* Optional description
* Added by
* Created timestamp
* Updated timestamp

Links can be:

* Created
* Edited
* Removed

---

# 31. URL SECURITY

Only HTTPS URLs are allowed.

Allowed:

```text
https://github.com/...
```

Not allowed:

```text
javascript:
data:
file:
http:
```

URLs must be validated before being stored.

The Work system must not become a vector for arbitrary executable links.

---

# 32. WORK ACTIVITY

`WorkActivity` is the detailed history system for individual Works.

It is separate from the global `AuditLog`.

WorkActivity answers:

> Who changed what, when, and from what value to what value?

---

# 33. WORK ACTIVITY IS IMMUTABLE

WorkActivity is immutable.

Once created:

* Cannot be edited.
* Cannot be deleted through normal operations.
* Cannot be rewritten.
* Remains after Work archival.
* Remains after Work restoration.

The activity history is append-only.

---

# 34. BEFORE / AFTER LOGGING

Meaningful changes should record before and after values.

Example:

```text
Admin changed task title

Before:
Implement authentication

After:
Implement authentication middleware
```

For multiple fields:

```text
title

Before:
Old title

After:
New title


description

Before:
Old description

After:
New description
```

The exact database structure may use:

```text
before
after
```

or a structured change object.

---

# 35. WORK ACTIVITY EVENTS

Potential WorkActivity events include:

```text
WORK_CREATED
WORK_UPDATED
WORK_LOCKED
WORK_UNLOCKED
WORK_ARCHIVED
WORK_RESTORED
WORK_REORDERED
WORK_OWNER_CHANGED

PARTICIPANT_ADDED
PARTICIPANT_REMOVED

TASK_CREATED
TASK_UPDATED
TASK_COMPLETED
TASK_REOPENED
TASK_ARCHIVED
TASK_REORDERED

SUBTASK_CREATED
SUBTASK_UPDATED
SUBTASK_COMPLETED
SUBTASK_REOPENED
SUBTASK_ARCHIVED
SUBTASK_REORDERED

COMMENT_CREATED
COMMENT_UPDATED
COMMENT_DELETED

LINK_CREATED
LINK_UPDATED
LINK_DELETED
```

The list can expand as implementation requirements become clearer.

---

# 36. GLOBAL AUDIT LOG

The existing global `AuditLog` remains separate.

It is intended for system/security-level auditing.

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
ADMIN_CREATED
ADMIN_UPDATED
ADMIN_DELETED
```

The global AuditLog is **not the same thing as WorkActivity**.

WorkActivity contains detailed collaboration history.

AuditLog contains system/security audit events.

---

# 37. WORK ACTIVITY UI

Activity history appears directly inside the Work UI.

Example:

```text
Admin A
Changed task title

Before:
Implement authentication

After:
Implement authentication middleware

2 minutes ago
```

This allows admins to understand what happened without opening a separate global audit system.

The global AuditLog remains separate.

---

# 38. SECURITY PHILOSOPHY

Security should correspond to the potential damage caused by an operation.

The general model is:

```text
Normal
   ↓
Elevated
   ↓
High
```

The more destructive or difficult-to-recover an operation is, the stronger the authorization requirement should become.

---

# 39. WORK SECURITY MATRIX

Current agreed baseline:

| Operation               | Security              |
| ----------------------- | --------------------- |
| View Work               | Normal authentication |
| Create Work             | Normal authentication |
| Edit Work               | Normal authentication |
| Complete Task           | Normal authentication |
| Reopen Task             | Normal authentication |
| Archive Work            | Elevated              |
| Restore Work            | Elevated              |
| Delete Work             | Elevated              |
| Permanently delete Work | High                  |

The exact implementation of "Elevated" and "High" is intentionally flexible.

---

# 40. 2FA AND WORK

Work operations do NOT automatically require 2FA.

The Work system should not assume:

* Trusted devices exist.
* 2FA exists.
* Authenticator apps exist.
* Every project requires step-up authentication.

This Work system should be reusable in projects with simpler authentication.

For this project specifically:

> **No 2FA requirement for Work operations.**

---

# 41. WORK PASSWORD

The Work system may support an additional Work-level password/access configuration.

Possible Work configurations include:

### Open View

Users with normal access can view.

### Protected Work

Additional password is required.

### Collaborative Work

Authorized participants can actively interact with it.

The exact access configuration should be represented in a flexible model rather than hardcoding one security behavior.

---

# 42. TRUSTED DEVICES / AUTHENTICATION CONTEXT

The broader admin authentication system already uses:

* JWT
* AdminSession
* Session expiration
* Session revocation
* Token version
* Trusted devices
* 2FA

The Work system should use the existing authentication/session architecture.

It should NOT create a second authentication system.

---

# 43. ADMIN SESSION SECURITY

Existing authentication validates:

1. JWT.
2. `sessionId`.
3. AdminSession existence.
4. Session revocation.
5. Session expiration.
6. Admin existence.
7. Token version.
8. Admin ACTIVE status.

Work endpoints should use this existing authentication middleware.

---

# 44. DESTRUCTIVE ACTION PHILOSOPHY

Normal operations should be reversible.

Preferred:

```text
Delete → Archive
```

rather than:

```text
Delete → Destroy
```

Permanent destruction should be exceptional.

The system should make accidental irreversible actions difficult.

---

# 45. PERMANENT DELETION

Permanent deletion exists.

It is the highest-risk operation.

Only:

```text
Superadmin
+
High authentication/authorization
```

can perform permanent destruction.

Permanent deletion should not be used for normal cleanup.

---

# 46. WORK STATES

Work has separate status and lock concepts.

Recommended status:

```text
IN_PROGRESS
COMPLETED
ARCHIVED
```

Separate property:

```text
isLocked: Boolean
```

Possible combinations:

```text
IN_PROGRESS + unlocked
IN_PROGRESS + locked

COMPLETED + unlocked
COMPLETED + locked

ARCHIVED
```

Archived Work is always read-only.

---

# 47. TASK STATES

Conceptually:

```text
INCOMPLETE
COMPLETED
ARCHIVED
```

Task completion is derived from:

* Direct checkbox when no Subtasks exist.
* Subtask completion when Subtasks exist.

---

# 48. SUBTASK STATES

Conceptually:

```text
INCOMPLETE
COMPLETED
ARCHIVED
```

---

# 49. UI SCROLLBARS

The Work system must use the project's existing design language.

Browser-default scrollbar styling should not cause Work UI to look visually disconnected.

Custom scrollbar styling should be implemented where needed.

This applies to:

* Vertical scrolling.
* Horizontal scrolling.
* Work lists.
* Task lists.
* Activity panels.
* Modal content where applicable.

---

# 50. CHECKBOX DESIGN

Work checkboxes should use the same design language as the primary application.

Do not use browser-default checkbox styling.

Checkboxes should visually integrate with:

* Existing colors.
* Borders.
* Hover states.
* Focus states.
* Completion states.
* Dark/light surface system.

---

# 51. RESPONSIVE UI

Work UI must work across:

* Desktop
* Tablet
* Mobile

Drag/reorder interaction should remain usable on smaller screens.

---

# 52. BACKEND ARCHITECTURE

Initial backend structure:

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
    └── existing auth/security middleware
```

Additional files can be introduced when needed.

---

# 53. DATABASE MODELS

Initial models:

```text
Work
WorkTask
WorkSubtask
WorkActivity
```

Likely relationships:

```text
Work
 ├── owner/creator → Admin
 ├── participants → Admin[]
 ├── tasks → WorkTask[]
 ├── comments
 ├── links
 └── activity → WorkActivity[]

WorkTask
 ├── work → Work
 ├── subtasks
 └── activity references

WorkSubtask
 └── task → WorkTask

WorkActivity
 ├── work
 ├── actor/admin
 └── target
```

Exact schema should be determined during implementation.

---

# 54. API ARCHITECTURE

Work should have dedicated routes.

Example:

```text
/api/work
```

Potential routes:

```text
GET    /api/work
POST   /api/work

GET    /api/work/:workId
PATCH  /api/work/:workId

POST   /api/work/:workId/archive
POST   /api/work/:workId/restore

POST   /api/work/:workId/lock
POST   /api/work/:workId/unlock

POST   /api/work/:workId/participants
DELETE /api/work/:workId/participants/:adminId

POST   /api/work/:workId/tasks
PATCH  /api/work/:workId/tasks/:taskId
POST   /api/work/:workId/tasks/:taskId/archive

POST   /api/work/:workId/tasks/:taskId/subtasks
PATCH  /api/work/:workId/tasks/:taskId/subtasks/:subtaskId
POST   /api/work/:workId/tasks/:taskId/subtasks/:subtaskId/archive
```

Exact routes are implementation decisions and may change.

---

# 55. WORK CONTROLLER

The controller should handle:

* Work creation.
* Work retrieval.
* Work update.
* Archive.
* Restore.
* Lock.
* Unlock.
* Ownership transfer.
* Participant management.
* Task operations.
* Subtask operations.
* Progress calculation.
* Reordering.
* Comments.
* Links.
* Activity creation.

Controllers should not bypass authorization.

---

# 56. AUTHORIZATION

Authentication answers:

> Is this person logged in?

Authorization answers:

> Is this admin allowed to perform this operation?

Work authorization must consider:

```text
Admin role
Work owner
Participant status
Work state
Work lock state
Archive state
Operation security level
```

---

# 57. AUTHORIZATION EXAMPLES

Participant attempting to edit Work title:

```text
Authenticated: YES
Participant: YES
Owner: NO
Superadmin: NO

Result:
403 Forbidden
```

Participant attempting to complete a Task on unlocked Work:

```text
Authenticated: YES
Participant: YES
Work locked: NO

Result:
Allowed
```

Participant attempting to complete Task on locked Work:

```text
Authenticated: YES
Participant: YES
Work locked: YES

Result:
Forbidden
```

Creator unlocking their Work:

```text
Authenticated: YES
Owner: YES

Result:
Allowed
```

Superadmin unlocking another admin's Work:

```text
Authenticated: YES
Superadmin: YES

Result:
Allowed
```

---

# 58. ACTIVITY LOGGING RULE

Meaningful Work changes should create immutable WorkActivity entries.

Do not log every insignificant UI interaction.

Examples that SHOULD be logged:

```text
Task created
Task title changed
Task completed
Task reopened
Task archived
Task reordered
Participant added
Participant removed
Work locked
Work unlocked
Work archived
Work restored
Ownership transferred
Comment created
Comment edited
Comment deleted
Link added
Link edited
Link removed
```

Examples that generally should NOT be logged:

```text
User opened Work page
User hovered button
User opened modal
User refreshed page
```

---

# 59. IMPORT / SEED SYSTEM

The original Work concept includes future ability to construct Work data in text and import it.

Example conceptual structure:

```text
Work 1
  Task 1
  Task 1.1
  Task 2
  Task 2.1
  Task 3
  Task 4

Work 2
  Task 1
  Task 2
  Task 3
  Task 4
    Task 4.1
    Task 4.2
```

The eventual import system should allow structured Work/Task/Subtask data to be generated or pasted for initial setup.

The exact syntax is not finalized yet.

---

# 60. FUTURE MENTION SYSTEM

Comments can eventually support:

```text
@AdminName
```

Future behavior:

1. Admin writes comment.
2. Admin mentions another admin.
3. Mention creates notification.
4. Mentioned admin sees notification.

This is **not part of the initial implementation**.

---

# 61. NO ATTACHMENTS FOR NOW

File attachments are intentionally excluded for now.

Instead, Work supports external links.

Examples:

```text
GitHub repository
GitHub issue
Documentation
Deployment
Design file
API endpoint documentation
```

Actual file-upload support can be added later.

---

# 62. WORK VS PORTFOLIO

The Work system must remain separate from visitor-facing portfolio content.

Visitors do not see:

* Work checklist.
* Work Activity.
* Admin comments.
* Participant management.
* Internal development notes.
* Internal links.
* Admin progress.

The Work system is an internal administrative feature.

---

# 63. WORK VS GLOBAL AUDIT LOG

These systems serve different purposes.

## Global AuditLog

Security/system audit.

Example:

```text
Admin logged in.
Admin failed login.
Admin changed password.
Admin enabled 2FA.
Admin revoked trusted device.
Admin created another admin.
```

## WorkActivity

Detailed Work collaboration history.

Example:

```text
Admin A changed Task title.

Before:
Implement authentication

After:
Implement authentication middleware
```

Both systems should exist independently.

---

# 64. SECURITY SYSTEM RELATIONSHIP

The broader project already contains security concepts such as:

```text
JWT
AdminSession
2FA
Trusted Device
Token Version
Session Revocation
AuditLog
```

These remain part of the overall admin security architecture.

The Work system uses the existing authentication infrastructure.

Work-specific authorization sits on top of it.

---

# 65. WORK SECURITY MUST REMAIN FLEXIBLE

The Work specification is designed as a reusable concept.

Not every project will require:

```text
2FA
Trusted Devices
Authenticator Apps
Step-up Authentication
```

Therefore Work security should be configurable.

For this project:

```text
No Work-specific 2FA.
```

For another project, stronger authentication can be added without redesigning the Work domain model.

---

# 66. DATA RECOVERY PRINCIPLE

The Work system follows:

```text
Normal mistake
    ↓
Recoverable

Archive
    ↓
Restorable

Permanent deletion
    ↓
Exceptional / High security
```

History should survive normal state transitions.

---

# 67. IMPLEMENTATION ORDER

Recommended implementation sequence:

## Phase 1 — Database

Create:

```text
Work.js
WorkTask.js
WorkSubtask.js
WorkActivity.js
```

---

## Phase 2 — Authorization

Integrate:

```text
protect middleware
```

Then add Work-specific authorization helpers.

---

## Phase 3 — Work CRUD

Implement:

```text
Create Work
Read Work
Update Work
Archive Work
Restore Work
```

---

## Phase 4 — Participants

Implement:

```text
List admins
Add participant
Remove participant
Transfer ownership
```

---

## Phase 5 — Tasks

Implement:

```text
Create
Edit
Complete
Reopen
Archive
Reorder
```

---

## Phase 6 — Subtasks

Implement:

```text
Create
Edit
Complete
Reopen
Archive
Reorder
```

---

## Phase 7 — Progress

Implement automatic:

```text
Subtask → Task progress
Task → Work progress
```

---

## Phase 8 — Locking

Implement:

```text
Lock
Unlock
Locked restrictions
```

---

## Phase 9 — Activity

Implement immutable:

```text
WorkActivity
```

with before/after changes.

---

## Phase 10 — Comments

Implement:

```text
Create
Edit own
Delete own
Superadmin moderation
```

---

## Phase 11 — Links

Implement:

```text
Create
Edit
Remove
HTTPS validation
```

---

## Phase 12 — UI

Build:

```text
Work list
Work detail
Task list
Subtask list
Participants
Activity
Comments
Links
Archive
```

---

## Phase 13 — Drag/Reorder

Implement persistent:

```text
Work order
Task order
Subtask order
```

---

## Phase 14 — Import

Add structured Work/Task/Subtask import once the core system is stable.

---

# 68. UNDECIDED / DO NOT IMPLEMENT YET

The following are intentionally not fully specified yet:

* Exact Work password UX.
* Exact Work access modes/data model.
* Exact Elevated authentication implementation.
* Exact High authentication implementation.
* Exact permanent deletion confirmation flow.
* Exact import syntax.
* Mention notification implementation.
* File attachments.
* Notification center.
* Advanced Work search/filtering.
* Advanced Work analytics.
* Exact WorkActivity schema for every possible change.
* Exact API route naming if implementation requires adjustment.

Do not invent these requirements without discussion.

---

# 69. CURRENT AGREEMENT SUMMARY

The essential rules are:

```text
Work is permanent.
Work is internal.
Work is database-backed.
Work is separate from portfolio content.

Work
 └── Task
      └── Subtask

Tasks are weighted equally for Work progress.

No manual percentages.

Task without subtasks:
    checkbox controls completion.

Task with subtasks:
    subtasks determine completion.

100% subtasks:
    Task completed.

Reopen subtask:
    Task incomplete.

Completed Work:
    can still receive Tasks.

Adding incomplete Task:
    Work becomes incomplete.

Completed ≠ Locked.

Locked Work:
    cannot add/complete/modify normal work,
    but reopening and comments remain allowed.

Archived Work:
    read-only.

Archive is reversible.

Permanent deletion:
    Superadmin + High security.

Participants:
    contributors.

Creator:
    owner.

Superadmin:
    global authority.

Participants:
    can contribute,
    reorder Tasks,
    finish work,
    comment,
    add links.

Participants:
    cannot manage ownership,
    participants,
    locking,
    archiving,
    permissions.

Creator:
    manages own Work.

Superadmin:
    manages everything.

WorkActivity:
    immutable.

WorkActivity:
    detailed Work history.

AuditLog:
    separate global security/system history.

Comments:
    author can edit/delete own.
    Superadmin can moderate any.

Links:
    editable/removable.
    HTTPS only.

No attachments for now.

No Work-specific 2FA.

Security should remain flexible.

No unnecessary destruction.
```

---

# 70. SOURCE-OF-TRUTH RULE

This document is the current specification.

When implementation questions arise:

1. Check this document first.
2. Follow the agreed behavior.
3. If a requirement is missing, mark it **UNDECIDED**.
4. Do not silently invent behavior.
5. Discuss the new behavior.
6. Update this specification.
7. Only then implement it.

The implementation should follow the specification, not the other way around.

---

# 71. QUICK REMINDER FOR FUTURE CHATGPT SESSIONS

When continuing this project, provide this summary if necessary:

> We are building a permanent backend/database-backed internal Work system for an admin portfolio project. It is separate from the public portfolio and separate from the global AuditLog. The hierarchy is Work → Task → Subtask. Work progress is automatic and based on equally weighted Tasks. Tasks without subtasks use a direct checkbox; Tasks with subtasks derive progress from their subtasks. No manual percentages. Completed does not mean locked. A completed Work can receive new Tasks and become incomplete again. Work can be locked, which prevents new/normal modifications but still allows reopening and comments. Work can be archived and restored; archived Work is read-only. Tasks and Subtasks are archived rather than normally destroyed. Permanent deletion is a Superadmin/high-security operation.
>
> Participants are contributors. They can view, complete/reopen work, reorder Tasks, comment, and add links. They cannot edit Work title/description, manage participants, lock/unlock, archive/restore, transfer ownership, or change permissions. The Work creator owns the Work and can manage it, including participants, locking, archiving, restoring, ordering, permissions, and ownership transfer. Superadmin can manage any Work and perform high-risk operations.
>
> WorkActivity is immutable and records detailed Work changes, including before/after values such as task title changes. Global AuditLog remains separate for system/security events. Comments can be edited/deleted by their author and moderated by Superadmin. Links support title, HTTPS URL, optional description, creator, and editing/removal. No file attachments yet. @mentions are planned but notifications are not implemented yet. Work-specific 2FA is explicitly not required; the system should remain flexible for projects with different security models. Existing JWT/AdminSession/security middleware should be reused.
