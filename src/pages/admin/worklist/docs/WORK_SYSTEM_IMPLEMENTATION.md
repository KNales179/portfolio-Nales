WORK SYSTEM — IMPLEMENTATION SPECIFICATION

Purpose:
Build a permanent backend/database-backed Work Management system for the admin panel. This is separate from the portfolio's public content and separate from the main Audit Log UI, although the Work system has its own immutable WorkActivity history displayed within the Work UI.

============================================================
1. CORE STRUCTURE
============================================================

Work
 ├── Tasks
 │    └── Subtasks
 ├── Participants
 ├── Comments
 ├── Links
 └── WorkActivity

Backend models:

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

The system must be persistent and database-backed. Nothing important should be hardcoded into the frontend.

============================================================
2. WORK
============================================================

Each Work contains:

- title
- description
- creator
- owner
- participants
- tasks
- ordering
- status
- progress
- locked state
- archived state
- access/security configuration
- comments
- links
- timestamps
- activity history

Work progress is AUTOMATIC.

There is NO manual percentage field.

Work progress is calculated from TASKS.

Example:

Work
 ├── Task A [100%]
 ├── Task B [50%]
 └── Task C [0%]

Work progress = average task completion.

The number of subtasks inside a task does NOT give that task additional weight.

Progress is based on tasks, not the total number of subtasks.

Progress starts at 0%.

A Work can reach 100% and become completed without becoming locked.

Completed Work is still editable if it is unlocked.

Adding a new task to a completed Work automatically changes its progress and can make it incomplete again.

Completed ≠ Locked.

============================================================
3. WORK STATUS
============================================================

Work statuses must be formally represented.

At minimum:

- ACTIVE / IN PROGRESS
- COMPLETED
- ARCHIVED

Locking is a separate property from completion.

Archived Work:

- disappears from the normal Work list
- remains visible in Archive
- is read-only
- cannot be edited
- cannot be reordered
- cannot have tasks/subtasks changed
- keeps all tasks
- keeps all subtasks
- keeps participants
- keeps comments
- keeps links
- keeps activity history
- can be restored
- restoration returns it exactly to its previous state

No data is destroyed when archiving.

============================================================
4. WORK LOCK
============================================================

A Work has a lock/unlock control.

When LOCKED:

Cannot:

- add tasks
- add subtasks
- delete/archive tasks
- delete/archive subtasks
- edit task descriptions
- reorder tasks
- reorder subtasks
- add links
- complete tasks
- complete subtasks

Still allowed:

- reopen completed tasks
- reopen completed subtasks
- add comments

Creator and Superadmin can unlock the Work.

Participants cannot lock or unlock Work.

A completed Work does NOT automatically lock.

A Work can remain completed and unlocked.

============================================================
5. TASKS
============================================================

Tasks have:

- title
- description
- completion state
- ordering
- subtasks
- archived state
- timestamps

A Task may have NO subtasks.

If a Task has no subtasks:

- its checkbox directly controls completion.

If a Task has subtasks:

- Task progress is derived from subtasks.
- Task completion is based on all subtasks.
- 100% subtasks = completed Task.
- Reopening any subtask makes the Task incomplete again.

No manual task percentage.

Tasks can still be added even when the Work is already 100% completed, as long as the Work is unlocked.

Tasks cannot be permanently destroyed through normal operations.

Task deletion means ARCHIVE.

Archived Tasks remain recoverable.

============================================================
6. SUBTASKS
============================================================

Subtasks have:

- title
- description
- completion state
- ordering
- archived state
- timestamps
- optional links where applicable

Subtasks are optional.

A Task can exist without subtasks.

Subtasks use checkboxes.

No manual percentage.

Subtasks can be reordered by users who have permission to edit the Work.

Subtasks cannot be permanently destroyed through normal operations.

Subtask deletion means ARCHIVE.

============================================================
7. DRAG AND DROP ORDERING
============================================================

No sorting system is required.

Admins can manually drag and reorder:

- Works
- Tasks
- Subtasks

Work ordering:

- Only Superadmin and Work Creator can reorder Works.

Task/Subtask ordering:

- Users who have permission to edit the Work can reorder Tasks/Subtasks.
- Participants are allowed to reorder Tasks/Subtasks.

Ordering changes must be recorded in WorkActivity.

============================================================
8. PARTICIPANTS
============================================================

A Work contains a participant list.

The UI must list ALL admins and provide a checkbox for selecting participants.

Participants are contributors, not owners.

Creator and Superadmin can:

- add participants
- remove participants

Participants cannot:

- add/remove participants
- edit Work title
- edit Work description
- lock/unlock Work
- archive Work
- restore Work
- transfer ownership
- change Work permissions

Participants CAN:

- complete tasks
- reopen tasks
- complete subtasks
- reopen subtasks
- reorder Tasks
- reorder Subtasks
- add comments
- edit/delete their own comments
- add links
- edit/remove links where Work permissions allow

The creator and Superadmin have broader Work management permissions.

============================================================
9. OWNERSHIP
============================================================

Work has a creator and owner.

Ownership can be transferred.

Only:

- Creator
- Superadmin

can transfer ownership.

If the Work owner/creator is deactivated:

- ownership automatically transfers to Superadmin
- the Work does NOT become ownerless
- existing participants retain their editing access
- Superadmin may later manually transfer ownership to another Admin

Creator cannot simply remove themselves as owner.

They must transfer ownership first.

Superadmin cannot accidentally remove the Work creator without handling ownership appropriately.

============================================================
10. WORK PERMISSIONS
============================================================

Basic permission model:

NORMAL AUTHENTICATION:

- View Work
- Create Work
- Edit Work
- Complete Task
- Reopen Task
- Complete Subtask
- Reopen Subtask
- Add Comments
- Add Links
- Reorder Tasks/Subtasks where permitted

ELEVATED:

- Archive Work
- Restore Work
- Creator/Superadmin management actions

HIGH:

- Permanent deletion of Work

No 2FA is required specifically for Work operations.

However, Work can have its OWN access/password configuration.

============================================================
11. WORK ACCESS / PASSWORD
============================================================

Work security must be flexible.

Not every Work needs a password.

Possible Work access modes:

1. OPEN VIEW
   - Anyone with normal access can view.
   - Editing requires appropriate authentication/permission.

2. PASSWORD PROTECTED
   - Work requires its configured password to access protected functionality.

3. COLLABORATIVE
   - Authorized admins can view and contribute according to permissions.

The Work system must NOT assume every project requires:

- Trusted Device
- 2FA
- password protection

Security configuration should be flexible per project.

============================================================
12. WORK ARCHIVE
============================================================

Archive is reversible.

Creator and Superadmin can archive Work.

Archived Work:

- read-only
- cannot be reordered
- cannot receive new tasks
- cannot receive new subtasks
- cannot change tasks
- cannot change subtasks
- cannot change participants
- cannot change links
- cannot change comments

All existing data remains.

Restore returns the Work exactly as it was.

Restore is an Elevated operation.

============================================================
13. PERMANENT DELETION
============================================================

Permanent deletion exists.

It is the nuclear/destructive operation.

Only:

- Superadmin
- High authentication/security level

can permanently delete Work.

Normal users cannot destroy Work data.

The normal lifecycle is:

ACTIVE → ARCHIVED → RESTORED

Permanent deletion is separate and intentionally difficult.

============================================================
14. TASK/SUBTASK ARCHIVING
============================================================

Tasks cannot normally be permanently deleted.

Subtasks cannot normally be permanently deleted.

Normal deletion means ARCHIVE.

Archived Tasks/Subtasks remain recoverable.

Permanent destruction requires the High/Superadmin destructive operation.

This follows the project's "do not destroy data unless explicitly decided" philosophy.

============================================================
15. COMMENTS / NOTES
============================================================

Work supports comments/notes.

Comments can eventually support @mentions.

Notifications for @mentions are NOT part of the initial implementation.

Comments:

- author can edit their own comment
- author can delete their own comment
- Superadmin can moderate/edit/delete any comment

Comment modifications must be recorded in immutable WorkActivity.

============================================================
16. LINKS
============================================================

Work supports links such as:

- GitHub
- documentation
- deployment
- references
- project resources

A Link contains:

- title
- URL
- optional description
- who added it
- timestamps

Links can be:

- edited
- removed

URL validation is required.

Allowed scheme:

https://

Do NOT allow arbitrary schemes.

No file attachments for now.

============================================================
17. WORK ACTIVITY
============================================================

WorkActivity is IMMUTABLE.

It must never be edited or deleted through normal application functionality.

Every meaningful Work change should create a WorkActivity entry.

Examples:

- Work created
- Work title changed
- Work description changed
- Task created
- Task archived
- Task restored
- Task title changed
- Task description changed
- Subtask created
- Subtask archived
- Subtask restored
- Subtask changed
- Task completed
- Task reopened
- Subtask completed
- Subtask reopened
- Work locked
- Work unlocked
- Work archived
- Work restored
- Participant added
- Participant removed
- Ownership transferred
- Task reordered
- Subtask reordered
- Work reordered
- Comment created
- Comment edited
- Comment deleted
- Link created
- Link edited
- Link removed

Activity must record meaningful BEFORE and AFTER values for changes.

Example:

Admin changed task title

Before:
"Implement authentication"

After:
"Implement authentication middleware"

For state changes, record the relevant previous and new state.

WorkActivity should include enough information to determine:

- who performed the action
- what happened
- what resource changed
- which Work was affected
- which Task/Subtask was affected where applicable
- when it happened
- relevant before state
- relevant after state
- IP address where appropriate
- user agent where appropriate

WorkActivity is separate from the global AuditLog.

============================================================
18. WORK ACTIVITY UI
============================================================

The Work UI must contain its own activity/history section.

Do NOT merge WorkActivity into the Portfolio's main Audit Log UI.

The Work Activity UI should show:

- actor
- action
- description
- timestamp
- affected resource
- before/after changes when applicable

Example:

Admin Bell changed Task title

Before:
"Implement authentication"

After:
"Implement authentication middleware"

The Activity history is immutable.

============================================================
19. GLOBAL AUDIT LOG
============================================================

The existing AuditLog remains separate.

It is intended for system/security/admin monitoring.

Examples:

- login
- failed login
- logout
- admin changes
- password changes
- 2FA events
- trusted device events
- system security events

WorkActivity should NOT replace AuditLog.

WorkActivity is specifically for Work collaboration/history.

============================================================
20. ADMIN PERMISSION MODEL
============================================================

Superadmin:

- edit any Work
- add/remove any participant
- unlock any Work
- archive any Work
- restore any Work
- permanently delete Work
- modify Work ordering
- modify comments
- modify links
- transfer ownership
- modify Work permissions

Creator:

- edit their Work
- add/remove participants
- archive their Work
- restore their Work
- lock/unlock their Work
- reorder their Work
- transfer ownership
- manage Work permissions
- participate in normal Work operations

Participant:

- contributor only
- complete/reopen tasks
- complete/reopen subtasks
- reorder Tasks/Subtasks
- comment
- edit/delete own comments
- add/edit/remove links where permitted

Participant cannot manage Work ownership, participants, locking, archive, restore, or permissions.

============================================================
21. SECURITY LEVEL PHILOSOPHY
============================================================

Security requirements should be based on:

- impact
- destructiveness
- reversibility
- sensitivity

Not every project requires:

- trusted device
- 2FA
- password
- elevated authentication

The system should support configurable security levels.

Work itself does NOT automatically require 2FA.

High-risk destructive actions should be protected by the project's configured authentication/security mechanism.

============================================================
22. UI REQUIREMENTS
============================================================

Work UI must be a permanent admin interface.

Each Work displays:

- title
- description
- progress bar
- status
- lock state
- creator/owner
- participants
- task list
- comments
- links
- Work Activity

Each Task displays:

- title
- description
- checkbox
- progress bar
- subtasks if present
- ordering controls

Each Subtask displays:

- small task/title context
- large subtask title
- description
- checkbox
- ordering controls
- relevant metadata

Checkboxes must use the same visual design system as the main application.

Do not use browser/default checkbox styling.

Scrollbars must match the application's existing visual design.

Both vertical and horizontal scrollbars should be styled consistently with the main UI instead of falling back to browser defaults.

============================================================
23. FRONTEND IMPLEMENTATION
============================================================

Create a dedicated Work management UI.

Do not hardcode Work data.

The frontend communicates with:

workRoutes.js
        ↓
workController.js
        ↓
Work / WorkTask / WorkSubtask / WorkActivity
        ↓
MongoDB

Authentication should use the existing protect middleware.

The frontend should receive current authenticated Admin information from the backend.

Participant selection should be dynamically populated from the Admin collection.

============================================================
24. BACKEND IMPLEMENTATION
============================================================

Required models:

Work.js
WorkTask.js
WorkSubtask.js
WorkActivity.js

Required controller:

workController.js

Required routes:

workRoutes.js

Use existing:

protect authentication middleware
Admin model
AdminSession model
AuditLog system where appropriate

WorkActivity should be generated server-side.

Do NOT trust the frontend to create its own activity history.

The backend must calculate progress.

The backend must enforce:

- ownership
- participant permissions
- creator permissions
- Superadmin permissions
- lock restrictions
- archive restrictions
- permanent deletion restrictions
- ordering permissions
- comment permissions
- link permissions
- participant permissions

============================================================
25. IMPORTANT DATA RULE
============================================================

Never rely on frontend state for security.

Frontend controls are only UI.

Every protected operation must be validated by the backend.

Example:

A participant attempting:

DELETE /work/:id/permanent

must be rejected by the backend even if they manually call the API.

Likewise:

- locked Work restrictions
- archived Work restrictions
- participant management
- ownership transfer
- Work deletion
- comment moderation
- link modification

must all be enforced server-side.

============================================================
26. IMPLEMENTATION ORDER
============================================================

Phase 1 — Database Models

Create:

- Work.js
- WorkTask.js
- WorkSubtask.js
- WorkActivity.js

Phase 2 — Backend Logic

Create:

- workController.js
- workRoutes.js

Implement:

- authentication
- permission checks
- Work CRUD
- task CRUD
- subtask CRUD
- archive/restore
- lock/unlock
- participant management
- ownership transfer
- ordering
- progress calculation
- comments
- links
- immutable activity logging

Phase 3 — Frontend API Layer

Create Work API functions for:

- Work list
- Work creation
- Work update
- Work archive
- Work restore
- Work lock/unlock
- participant management
- ownership transfer
- Task operations
- Subtask operations
- ordering
- comments
- links
- activity history

Phase 4 — Work UI

Build:

- Work list
- Work creation UI
- Work detail UI
- Work editing UI
- participant selector
- task list
- subtask list
- drag/reorder interface
- progress bars
- lock controls
- archive controls
- comments
- links
- activity history

Phase 5 — Security

Test:

- normal Admin permissions
- participant permissions
- creator permissions
- Superadmin permissions
- locked Work behavior
- archived Work behavior
- ownership transfer
- deactivated owner behavior
- permanent deletion restrictions

Phase 6 — Activity Verification

Verify every important mutation creates an immutable WorkActivity entry with:

- actor
- action
- resource
- description
- before
- after
- timestamp
- relevant Work/Task/Subtask ID

============================================================
27. FINAL DESIGN PRINCIPLE
============================================================

The Work system is designed around:

- collaboration
- recoverability
- auditability
- automatic progress
- explicit locking
- reversible archiving
- controlled destructive operations
- contributor-based permissions
- immutable history
- backend-enforced security

The guiding philosophy:

"Nothing important gets destroyed accidentally."

Normal users contribute.

Creators manage their Work.

Superadmins have full control.

Destructive operations are intentionally difficult.

Completed does not mean locked.

Archived does not mean deleted.

Deleted normally means archived.

Permanent deletion is the nuclear option.

WorkActivity remembers what happened.