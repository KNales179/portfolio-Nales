// ============================================================
// WORK PERMISSIONS
// ============================================================
//
// Frontend capability checks for the Work System.
//
// IMPORTANT:
// These functions only control UI visibility / interaction.
// They are NOT security.
//
// The backend must independently verify:
// - authenticated admin
// - work creator
// - participant
// - superadmin
// - archived state
// - locked state
// - any future access rules
//
// ============================================================


// ============================================================
// ID HELPERS
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


export const isWorkCreator = (admin, work) => {
    if (!admin || !work) {
        return false;
    }

    const creatorId = getId(work.createdBy);
    const adminId = getId(admin);

    return (
        creatorId !== null &&
        adminId !== null &&
        creatorId === adminId
    );
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
        (participant) =>
            getId(participant) === adminId
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
        work?.isLocked === true ||
        work?.locked === true
    );
};


export const isCompleted = (work) => {
    return work?.status === "COMPLETED";
};


// ============================================================
// WORK CREATION
// ============================================================

export const canCreateWork = (admin) => {
    return Boolean(admin);
};


// ============================================================
// CORE WORK ACCESS
// ============================================================

export const canViewWork = (
    admin,
    work
) => {
    return Boolean(
        admin &&
        work
    );
};


export const canEditWork = (
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

    if (isSuperAdmin(admin)) {
        return true;
    }

    return isWorkCreator(
        admin,
        work
    );
};


export const canEditWorkDetails = (
    admin,
    work
) => {
    return canEditWork(
        admin,
        work
    );
};


// ============================================================
// TASK CAPABILITIES
// ============================================================

export const canAddTask = (
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


export const canEditTask = (
    admin,
    work
) => {
    return canAddTask(
        admin,
        work
    );
};


export const canCompleteTask = (
    admin,
    work
) => {
    return canAddTask(
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
        isArchived(work)
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
    if (
        !admin ||
        !work
    ) {
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
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


export const canEditSubtask = (
    admin,
    work
) => {
    return canAddSubtask(
        admin,
        work
    );
};


export const canCompleteSubtask = (
    admin,
    work
) => {
    return canAddSubtask(
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
        isArchived(work)
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
    if (
        !admin ||
        !work
    ) {
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
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
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
        isWorkCreator(admin, work) ||
        isWorkParticipant(admin, work)
    );
};


// ============================================================
// LOCKING
// ============================================================

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


// ============================================================
// COMMENTS
// ============================================================

export const canAddComment = (
    admin,
    work
) => {
    return Boolean(
        admin &&
        work &&
        !isArchived(work)
    );
};


export const canEditComment = (
    admin,
    comment
) => {
    if (
        !admin ||
        !comment
    ) {
        return false;
    }

    if (isSuperAdmin(admin)) {
        return true;
    }

    return (
        getId(
            comment.admin ||
            comment.createdBy
        ) ===
        getId(admin)
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
    return canEditLink(
        admin,
        work
    );
};


// ============================================================
// ACTIVITY
// ============================================================

export const canViewWorkActivity = (
    admin,
    work
) => {
    return Boolean(
        admin &&
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
        canView:
            canViewWork(
                admin,
                work
            ),

        canCreate:
            canCreateWork(
                admin
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

        canReorderWorks:
            canReorderWorks(
                admin
            ),

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

        canAddComment:
            canAddComment(
                admin,
                work
            ),

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

        canViewActivity:
            canViewWorkActivity(
                admin,
                work
            ),
    };
};


export default getWorkPermissions;