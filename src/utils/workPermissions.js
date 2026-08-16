// ============================================================
// WORK PERMISSIONS
// ============================================================
//
// Frontend capability checks for the Work System.
//
// IMPORTANT:
// These functions ONLY control frontend UI visibility and
// interaction.
//
// They are NOT security.
//
// The backend MUST independently enforce:
// - authentication
// - role
// - work ownership
// - participant membership
// - archived state
// - locked state
// - task/subtask ownership rules
// - any future access/password rules
//
// ============================================================


// ============================================================
// ID NORMALIZATION
// ============================================================

export const getId = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "object") {
        return (
            value._id ||
            value.id ||
            null
        )?.toString?.() || null;
    }

    return null;
};


// ============================================================
// ROLE HELPERS
// ============================================================

export const isSuperAdmin = (admin) => {
    return admin?.role === "SUPER_ADMIN";
};


export const isAdmin = (admin) => {
    return admin?.role === "ADMIN";
};


// ============================================================
// WORK OWNERSHIP / MEMBERSHIP
// ============================================================

export const isWorkCreator = (admin, work) => {
    if (!admin || !work) {
        return false;
    }

    const adminId = getId(admin);

    const creatorId = getId(
        work.createdBy
    );

    if (!adminId || !creatorId) {
        return false;
    }

    return adminId === creatorId;
};


export const isWorkParticipant = (admin, work) => {
    if (!admin || !work) {
        return false;
    }

    const adminId = getId(admin);

    if (!adminId) {
        return false;
    }

    const participants =
        Array.isArray(work.participants)
            ? work.participants
            : [];

    return participants.some(
        (participant) => {
            /*
             * Backend participant structure:
             *
             * {
             *     admin: ObjectId,
             *     addedBy: ObjectId,
             *     addedAt: Date
             * }
             */

            return (
                getId(
                    participant?.admin ??
                    participant
                ) === adminId
            );
        }
    );
};


// ============================================================
// WORK STATE
// ============================================================

export const isArchived = (work) => {
    return work?.status === "ARCHIVED";
};


export const isLocked = (work) => {
    return (
        work?.locked === true ||
        work?.isLocked === true
    );
};


export const isCompleted = (work) => {
    return work?.status === "COMPLETED";
};


// ============================================================
// WORK CREATION
// ============================================================
//
// ONLY SUPER_ADMIN can create a Work.
//
// Regular ADMIN cannot create Work.
//
// This is intentionally explicit rather than relying on
// "authenticated admin".
//

export const canCreateWork = (admin) => {
    return Boolean(
        admin &&
        isSuperAdmin(admin)
    );
};


// ============================================================
// WORK VIEWING
// ============================================================
//
// Superadmin:
//     Can view everything.
//
// Creator:
//     Can view their work.
//
// Participant:
//     Can view participating work.
//
// Regular unrelated admin:
//     Cannot view the work.
//

export const canViewWork = (admin, work) => {
    if (!admin || !work) {
        return false;
    }

    if (isSuperAdmin(admin)) {
        return true;
    }

    return (
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


// ============================================================
// WORK MANAGEMENT
// ============================================================
//
// Superadmin:
//     Can manage every work.
//
// Creator:
//     Can manage their own work.
//
// Participant:
//     Cannot manage the work itself.
//

export const canManageWork = (admin, work) => {
    if (!admin || !work) {
        return false;
    }

    if (isArchived(work)) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canEditWork = (admin, work) => {
    return canManageWork(
        admin,
        work
    );
};


export const canEditWorkDetails = (
    admin,
    work
) => {
    return canManageWork(
        admin,
        work
    );
};


// ============================================================
// STRUCTURE MANAGEMENT
// ============================================================
//
// Structure means:
// - tasks
// - subtasks
// - ordering
//
// Superadmin:
//     Yes
//
// Creator:
//     Yes
//
// Participant:
//     Can work on existing tasks but cannot restructure
//     the Work itself.
//

export const canModifyWorkStructure = (
    admin,
    work
) => {
    return canManageWork(
        admin,
        work
    );
};


// ============================================================
// TASK CAPABILITIES
// ============================================================

export const canAddTask = (admin, work) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canEditTask = (admin, work) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


export const canCompleteTask = (
    admin,
    work
) => {
    return canEditTask(
        admin,
        work
    );
};


export const canReopenTask = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


export const canArchiveTask = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canRestoreTask = (
    admin,
    work
) => {
    if (!admin || !work) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


// ============================================================
// SUBTASK CAPABILITIES
// ============================================================

export const canAddSubtask = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canEditSubtask = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


export const canCompleteSubtask = (
    admin,
    work
) => {
    return canEditSubtask(
        admin,
        work
    );
};


export const canReopenSubtask = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


export const canArchiveSubtask = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canRestoreSubtask = (
    admin,
    work
) => {
    if (!admin || !work) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


// ============================================================
// REORDERING
// ============================================================

export const canReorderWorks = (admin) => {
    return isSuperAdmin(admin);
};


export const canReorderTasks = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canReorderSubtasks = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


// ============================================================
// LOCKING
// ============================================================
//
// Only:
// - SUPER_ADMIN
// - Work creator
//

export const canLockWork = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canUnlockWork = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        !isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


// ============================================================
// ARCHIVE / RESTORE
// ============================================================

export const canArchiveWork = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canRestoreWork = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        !isArchived(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


// ============================================================
// PARTICIPANTS
// ============================================================
//
// Only:
// - SUPER_ADMIN
// - Work creator
//
// can manage participants.
//

export const canManageParticipants = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work)
    );
};


export const canAddParticipant = (
    admin,
    work
) => {
    return canManageParticipants(
        admin,
        work
    );
};


export const canRemoveParticipant = (
    admin,
    work
) => {
    return canManageParticipants(
        admin,
        work
    );
};


export const canTransferOwnership = (
    admin,
    work
) => {
    return canManageParticipants(
        admin,
        work
    );
};


// ============================================================
// COMMENTS
// ============================================================

export const canAddComment = (
    admin,
    work
) => {
    if (!admin || !work) {
        return false;
    }

    return (
        !isArchived(work) &&
        (
            isSuperAdmin(admin) ||
            isWorkCreator(admin, work) ||
            isWorkParticipant(admin, work)
        )
    );
};


export const canEditComment = (
    admin,
    comment
) => {
    if (!admin || !comment) {
        return false;
    }

    if (isSuperAdmin(admin)) {
        return true;
    }

    return (
        getId(
            comment.admin ??
            comment.createdBy
        ) === getId(admin)
    );
};


export const canDeleteComment = (
    admin,
    comment
) => {
    return canEditComment(
        admin,
        comment
    );
};


// ============================================================
// LINKS
// ============================================================

export const canAddLink = (
    admin,
    work
) => {
    if (
        !admin ||
        !work ||
        isArchived(work) ||
        isLocked(work)
    ) {
        return false;
    }

    return (
        isSuperAdmin(admin) ||
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


export const canEditLink = (
    admin,
    work
) => {
    return canAddLink(
        admin,
        work
    );
};


export const canDeleteLink = (
    admin,
    work
) => {
    return canAddLink(
        admin,
        work
    );
};


// ============================================================
// ACTIVITY
// ============================================================
//
// Activity is immutable.
// Any authenticated admin who can view the Work can view
// its activity.
//

export const canViewWorkActivity = (
    admin,
    work
) => {
    return canViewWork(
        admin,
        work
    );
};


// ============================================================
// PERMISSION SUMMARY
// ============================================================

export const getWorkPermissions = (
    admin,
    work
) => {
    return {
        // Work
        canCreate:
            canCreateWork(admin),

        canView:
            canViewWork(
                admin,
                work
            ),

        canManage:
            canManageWork(
                admin,
                work
            ),

        canEdit:
            canEditWork(
                admin,
                work
            ),

        canEditDetails:
            canEditWorkDetails(
                admin,
                work
            ),

        canModifyStructure:
            canModifyWorkStructure(
                admin,
                work
            ),

        // Tasks
        canAddTask:
            canAddTask(
                admin,
                work
            ),

        canEditTask:
            canEditTask(
                admin,
                work
            ),

        canCompleteTask:
            canCompleteTask(
                admin,
                work
            ),

        canReopenTask:
            canReopenTask(
                admin,
                work
            ),

        canArchiveTask:
            canArchiveTask(
                admin,
                work
            ),

        canRestoreTask:
            canRestoreTask(
                admin,
                work
            ),

        // Subtasks
        canAddSubtask:
            canAddSubtask(
                admin,
                work
            ),

        canEditSubtask:
            canEditSubtask(
                admin,
                work
            ),

        canCompleteSubtask:
            canCompleteSubtask(
                admin,
                work
            ),

        canReopenSubtask:
            canReopenSubtask(
                admin,
                work
            ),

        canArchiveSubtask:
            canArchiveSubtask(
                admin,
                work
            ),

        canRestoreSubtask:
            canRestoreSubtask(
                admin,
                work
            ),

        // Ordering
        canReorderWorks:
            canReorderWorks(admin),

        canReorderTasks:
            canReorderTasks(
                admin,
                work
            ),

        canReorderSubtasks:
            canReorderSubtasks(
                admin,
                work
            ),

        // Lock
        canLock:
            canLockWork(
                admin,
                work
            ),

        canUnlock:
            canUnlockWork(
                admin,
                work
            ),

        // Archive
        canArchive:
            canArchiveWork(
                admin,
                work
            ),

        canRestore:
            canRestoreWork(
                admin,
                work
            ),

        // Participants
        canManageParticipants:
            canManageParticipants(
                admin,
                work
            ),

        canAddParticipant:
            canAddParticipant(
                admin,
                work
            ),

        canRemoveParticipant:
            canRemoveParticipant(
                admin,
                work
            ),

        canTransferOwnership:
            canTransferOwnership(
                admin,
                work
            ),

        // Comments
        canAddComment:
            canAddComment(
                admin,
                work
            ),

        // Links
        canAddLink:
            canAddLink(
                admin,
                work
            ),

        canEditLink:
            canEditLink(
                admin,
                work
            ),

        canDeleteLink:
            canDeleteLink(
                admin,
                work
            ),

        // Activity
        canViewActivity:
            canViewWorkActivity(
                admin,
                work
            ),
    };
};

export default getWorkPermissions;