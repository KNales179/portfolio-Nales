import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

// ============================================================
// ASSUMPTION: adjust this import to match your real admin-list
// endpoint. Participants.jsx needs a full admin list to populate
// its "add participant" picker, and no such fetch existed in the
// original WorkDetails.jsx.
// ============================================================
import { getAdmins } from "../../../services/adminService";

import {
    getWorkById,
    updateWork,
    archiveWork,
    restoreWork,
    lockWork,
    unlockWork,

    createTask,
    updateTask,
    completeTask,
    reopenTask,
    archiveTask,
    restoreTask,
    reorderTasks,

    createSubtask,
    updateSubtask,
    completeSubtask,
    reopenSubtask,
    archiveSubtask,
    restoreSubtask,
    reorderSubtasks,

    getWorkActivities,

    getWorkComments,
    createWorkComment,
    updateWorkComment,
    deleteWorkComment,

    getWorkLinks,
    createWorkLink,
    updateWorkLink,
    deleteWorkLink,

    getWorkParticipants,
    addWorkParticipant,
    removeWorkParticipant,
} from "../../../services/workApi";

import {
    canEditWork,
    canLockWork,
    canUnlockWork,
    canArchiveWork,
    canRestoreWork,

    canAddTask,
    canCompleteTask,
    canReopenTask,
    canArchiveTask,

    canAddSubtask,
    canCompleteSubtask,
    canReopenSubtask,
    canArchiveSubtask,

    canManageParticipants,
} from "../../../utils/workPermissions";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import Header from "./components/Header";
import Progress from "./components/Progress";
import Task from "./components/Task";
import Subtask from "./components/Subtask";
import Activity from "./components/Activity";
import Comments from "./components/Comments";
import Links from "./components/Links";
import Participants from "./components/Participants";

import {
    Loader2,
    Plus,
    X,
} from "lucide-react";


// ============================================================
// HELPERS
// ============================================================

const getId = (value) => {
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


const calculateLocalProgress = (
    taskList
) => {
    const activeTasks =
        taskList.filter(
            (task) =>
                task.status !== "ARCHIVED"
        );

    if (activeTasks.length === 0) {
        return 0;
    }

    const completedCount =
        activeTasks.filter(
            (task) => {
                const subtaskList =
                    Array.isArray(
                        task.subtasks
                    )
                        ? task.subtasks.filter(
                            (subtask) =>
                                subtask.status !== "ARCHIVED"
                        )
                        : [];

                if (
                    subtaskList.length === 0
                ) {
                    return (
                        task.status ===
                        "COMPLETED"
                    );
                }

                return subtaskList.every(
                    (subtask) =>
                        subtask.completed
                );
            }
        ).length;

    return Math.round(
        (completedCount /
            activeTasks.length) *
        100
    );
};


const normalizeArrayResponse = (
    response,
    key
) => {
    const value =
        response?.data?.[key] ??
        response?.[key] ??
        response?.data ??
        response;

    return Array.isArray(value)
        ? value
        : [];
};


// ============================================================
// COMPONENT
// ============================================================

function WorkDetails() {
    const navigate =
        useNavigate();

    const { workId } =
        useParams();

    const { admin } =
        useAuth();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [work, setWork] =
        useState(null);

    // ------------------------------------------------------
    // NOTE: tasks live in response.data.tasks, NOT nested
    // inside `work` (Work has no `tasks` field — WorkTask
    // documents just reference `work`). Tracked separately.
    // ------------------------------------------------------

    const [tasks, setTasks] =
        useState([]);

    const [progress, setProgress] =
        useState(0);

    const [activities, setActivities] =
        useState([]);

    const [comments, setComments] =
        useState([]);

    const [links, setLinks] =
        useState([]);

    const [participants, setParticipants] =
        useState([]);

    const [admins, setAdmins] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [activityLoading, setActivityLoading] =
        useState(false);

    const [activityError, setActivityError] =
        useState("");

    const [error, setError] =
        useState("");

    const [editingWork, setEditingWork] =
        useState(false);

    const [workTitle, setWorkTitle] =
        useState("");

    const [workDescription, setWorkDescription] =
        useState("");

    const [savingWork, setSavingWork] =
        useState(false);

    const [newTaskOpen, setNewTaskOpen] =
        useState(false);

    const [newTaskTitle, setNewTaskTitle] =
        useState("");

    const [newTaskDescription, setNewTaskDescription] =
        useState("");

    const [savingTask, setSavingTask] =
        useState(false);

    const [newSubtaskFor, setNewSubtaskFor] =
        useState(null);

    const [newSubtaskTitle, setNewSubtaskTitle] =
        useState("");

    const [newSubtaskDescription, setNewSubtaskDescription] =
        useState("");

    const [savingSubtask, setSavingSubtask] =
        useState(false);

    const [editingTask, setEditingTask] =
        useState(null);

    const [editTaskTitle, setEditTaskTitle] =
        useState("");

    const [editTaskDescription, setEditTaskDescription] =
        useState("");

    const [savingTaskEdit, setSavingTaskEdit] =
        useState(false);

    const [editingSubtask, setEditingSubtask] =
        useState(null);

    const [editSubtaskTitle, setEditSubtaskTitle] =
        useState("");

    const [editSubtaskDescription, setEditSubtaskDescription] =
        useState("");

    const [savingSubtaskEdit, setSavingSubtaskEdit] =
        useState(false);

    const [activityModalOpen, setActivityModalOpen] =
        useState(false);


    // ========================================================
    // WORK STATE
    // ========================================================

    const isArchived =
        work?.status ===
        "ARCHIVED";

    const isLocked =
        work?.isLocked === true ||
        work?.locked === true;


    // ========================================================
    // PERMISSIONS
    // ========================================================

    const canEdit =
        Boolean(
            work &&
            canEditWork(
                admin,
                work
            )
        );

    const canLock =
        Boolean(
            work &&
            canLockWork(
                admin,
                work
            )
        );

    const canUnlock =
        Boolean(
            work &&
            canUnlockWork(
                admin,
                work
            )
        );

    const canArchive =
        Boolean(
            work &&
            canArchiveWork(
                admin,
                work
            )
        );

    const canRestore =
        Boolean(
            work &&
            canRestoreWork(
                admin,
                work
            )
        );

    const canAddTasks =
        Boolean(
            work &&
            canAddTask(
                admin,
                work
            )
        );

    const canCompleteTasks =
        Boolean(
            work &&
            canCompleteTask(
                admin,
                work
            )
        );

    const canReopenTasks =
        Boolean(
            work &&
            canReopenTask(
                admin,
                work
            )
        );

    const canArchiveTasksPerm =
        Boolean(
            work &&
            canArchiveTask(
                admin,
                work
            )
        );

    const canAddSubtasks =
        Boolean(
            work &&
            canAddSubtask(
                admin,
                work
            )
        );

    const canCompleteSubtasks =
        Boolean(
            work &&
            canCompleteSubtask(
                admin,
                work
            )
        );

    const canReopenSubtasks =
        Boolean(
            work &&
            canReopenSubtask(
                admin,
                work
            )
        );

    const canArchiveSubtasksPerm =
        Boolean(
            work &&
            canArchiveSubtask(
                admin,
                work
            )
        );

    const canManageWorkParticipants =
        Boolean(
            work &&
            canManageParticipants(
                admin,
                work
            )
        );


    // ========================================================
    // FETCH WORK (+ tasks + progress, same response)
    // ========================================================

    const fetchWork = async (
        showLoader = false
    ) => {
        if (!workId) {
            return;
        }

        try {
            if (showLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response =
                await getWorkById(
                    workId
                );

            const fetchedWork =
                response?.data?.work ||
                response?.work ||
                null;

            const fetchedTasks =
                response?.data?.tasks ||
                response?.tasks ||
                [];

            const fetchedProgress =
                response?.data?.progress ??
                response?.progress ??
                0;

            if (!fetchedWork) {
                throw new Error(
                    "Work was not found."
                );
            }

            setWork(
                fetchedWork
            );

            setTasks(
                Array.isArray(
                    fetchedTasks
                )
                    ? fetchedTasks
                    : []
            );

            setProgress(
                fetchedProgress
            );

            setWorkTitle(
                fetchedWork.title ||
                ""
            );

            setWorkDescription(
                fetchedWork.description ||
                ""
            );

        } catch (err) {
            console.error(
                "Failed to load work:",
                err
            );

            setError(
                err?.message ||
                "Unable to load this work."
            );

            setWork(null);
            setTasks([]);

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // ========================================================
    // FETCH ACTIVITY
    // ========================================================

    const fetchActivities = async () => {
        if (!workId) {
            return;
        }

        try {
            setActivityLoading(true);
            setActivityError("");

            const response =
                await getWorkActivities(
                    workId
                );

            setActivities(
                normalizeArrayResponse(
                    response,
                    "activity"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load work activity:",
                err
            );

            setActivityError(
                err?.message ||
                "Unable to load activity."
            );
        } finally {
            setActivityLoading(false);
        }
    };


    // ========================================================
    // FETCH COMMENTS
    // ========================================================

    const fetchComments = async () => {
        if (!workId) {
            return;
        }

        try {
            const response =
                await getWorkComments(
                    workId
                );

            setComments(
                normalizeArrayResponse(
                    response,
                    "comments"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load comments:",
                err
            );
        }
    };


    // ========================================================
    // FETCH LINKS
    // ========================================================

    const fetchLinks = async () => {
        if (!workId) {
            return;
        }

        try {
            const response =
                await getWorkLinks(
                    workId
                );

            setLinks(
                normalizeArrayResponse(
                    response,
                    "links"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load links:",
                err
            );
        }
    };


    // ========================================================
    // FETCH PARTICIPANTS
    // ========================================================

    const fetchParticipants = async () => {
        if (!workId) {
            return;
        }

        try {
            const response =
                await getWorkParticipants(
                    workId
                );

            setParticipants(
                normalizeArrayResponse(
                    response,
                    "participants"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load participants:",
                err
            );
        }
    };


    // ========================================================
    // FETCH ADMINS (for the participant picker)
    // ========================================================

    const fetchAdmins = async () => {
        try {
            const response =
                await getAdmins();

            setAdmins(
                normalizeArrayResponse(
                    response,
                    "admins"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load admins:",
                err
            );
        }
    };


    // ========================================================
    // REFRESH EVERYTHING
    // ========================================================

    const refreshAll = async () => {
        if (!workId) {
            return;
        }

        setRefreshing(true);

        try {
            await Promise.all([
                fetchWork(true),
                fetchActivities(),
                fetchComments(),
                fetchLinks(),
                fetchParticipants(),
            ]);
        } finally {
            setRefreshing(false);
        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        if (!workId) {
            return;
        }

        fetchWork();
        fetchActivities();
        fetchComments();
        fetchLinks();
        fetchParticipants();
        fetchAdmins();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workId]);


    // ========================================================
    // UPDATE WORK
    // ========================================================

    const handleSaveWork = async () => {
        if (
            !work ||
            !canEdit
        ) {
            return;
        }

        const title =
            workTitle.trim();

        const description =
            workDescription.trim();

        if (!title) {
            setError(
                "Work title is required."
            );

            return;
        }

        try {
            setSavingWork(true);
            setError("");

            await updateWork(
                workId,
                {
                    title,
                    description,
                }
            );

            setEditingWork(false);

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to update work:",
                err
            );

            setError(
                err?.message ||
                "Unable to update work."
            );

        } finally {
            setSavingWork(false);
        }
    };


    // ========================================================
    // ARCHIVE / RESTORE / LOCK / UNLOCK
    // ========================================================

    const handleArchive = async () => {
        if (!canArchive) {
            return;
        }

        try {
            setError("");

            await archiveWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to archive work."
            );
        }
    };


    const handleRestore = async () => {
        if (!canRestore) {
            return;
        }

        try {
            setError("");

            await restoreWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to restore work."
            );
        }
    };


    const handleLock = async () => {
        if (!canLock) {
            return;
        }

        try {
            setError("");

            await lockWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to lock work."
            );
        }
    };


    const handleUnlock = async () => {
        if (!canUnlock) {
            return;
        }

        try {
            setError("");

            await unlockWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to unlock work."
            );
        }
    };


    // ========================================================
    // CREATE TASK
    // ========================================================

    const handleCreateTask = async () => {
        if (!canAddTasks) {
            return;
        }

        const title =
            newTaskTitle.trim();

        if (!title) {
            return;
        }

        try {
            setSavingTask(true);
            setError("");

            await createTask(
                workId,
                {
                    title,
                    description:
                        newTaskDescription.trim(),
                }
            );

            setNewTaskTitle("");
            setNewTaskDescription("");
            setNewTaskOpen(false);

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to create task:",
                err
            );

            setError(
                err?.message ||
                "Unable to create task."
            );

        } finally {
            setSavingTask(false);
        }
    };


    // ========================================================
    // EDIT TASK
    // ========================================================

    const openEditTask = (task) => {
        setEditingTask(task);
        setEditTaskTitle(
            task?.title || ""
        );
        setEditTaskDescription(
            task?.description || ""
        );
    };

    const closeEditTask = () => {
        if (savingTaskEdit) {
            return;
        }

        setEditingTask(null);
        setEditTaskTitle("");
        setEditTaskDescription("");
    };

    const handleSaveTaskEdit = async () => {
        if (
            !editingTask ||
            !editTaskTitle.trim()
        ) {
            return;
        }

        try {
            setSavingTaskEdit(true);
            setError("");

            await updateTask(
                editingTask._id,
                {
                    title:
                        editTaskTitle.trim(),
                    description:
                        editTaskDescription.trim(),
                }
            );

            closeEditTask();

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to update task:",
                err
            );

            setError(
                err?.message ||
                "Unable to update task."
            );

        } finally {
            setSavingTaskEdit(false);
        }
    };


    // ========================================================
    // CREATE SUBTASK
    // ========================================================

    const handleCreateSubtask = async (
        taskId
    ) => {
        if (
            !canAddSubtasks ||
            !taskId
        ) {
            return;
        }

        const title =
            newSubtaskTitle.trim();

        if (!title) {
            return;
        }

        try {
            setSavingSubtask(true);
            setError("");

            await createSubtask(
                taskId,
                {
                    title,
                    description:
                        newSubtaskDescription.trim(),
                }
            );

            setNewSubtaskTitle("");
            setNewSubtaskDescription("");
            setNewSubtaskFor(null);

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to create subtask:",
                err
            );

            setError(
                err?.message ||
                "Unable to create subtask."
            );

        } finally {
            setSavingSubtask(false);
        }
    };


    // ========================================================
    // EDIT SUBTASK
    // ========================================================

    const openEditSubtask = (subtask) => {
        setEditingSubtask(subtask);
        setEditSubtaskTitle(
            subtask?.title || ""
        );
        setEditSubtaskDescription(
            subtask?.description || ""
        );
    };

    const closeEditSubtask = () => {
        if (savingSubtaskEdit) {
            return;
        }

        setEditingSubtask(null);
        setEditSubtaskTitle("");
        setEditSubtaskDescription("");
    };

    const handleSaveSubtaskEdit = async () => {
        if (
            !editingSubtask ||
            !editSubtaskTitle.trim()
        ) {
            return;
        }

        try {
            setSavingSubtaskEdit(true);
            setError("");

            await updateSubtask(
                editingSubtask._id,
                {
                    title:
                        editSubtaskTitle.trim(),
                    description:
                        editSubtaskDescription.trim(),
                }
            );

            closeEditSubtask();

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to update subtask:",
                err
            );

            setError(
                err?.message ||
                "Unable to update subtask."
            );

        } finally {
            setSavingSubtaskEdit(false);
        }
    };


    // ========================================================
    // TASK TOGGLE / ARCHIVE
    // ========================================================

    const handleTaskToggle = async (
        task
    ) => {
        const taskId = task?._id;

        if (!taskId) {
            return;
        }

        const shouldComplete =
            task.status !== "COMPLETED";

        if (
            shouldComplete &&
            !canCompleteTasks
        ) {
            return;
        }

        if (
            !shouldComplete &&
            !canReopenTasks
        ) {
            return;
        }

        const previousTasks = tasks;
        const previousProgress = progress;

        const optimisticTasks =
            tasks.map(
                (item) =>
                    String(item._id) === String(taskId)
                        ? {
                            ...item,
                            status:
                                shouldComplete
                                    ? "COMPLETED"
                                    : "INCOMPLETE",
                            completed:
                                shouldComplete,
                        }
                        : item
            );

        setTasks(optimisticTasks);

        setProgress(
            calculateLocalProgress(
                optimisticTasks
            )
        );

        setError("");

        try {
            if (shouldComplete) {
                await completeTask(
                    taskId
                );
            } else {
                await reopenTask(
                    taskId
                );
            }

            // Local state already reflects the change.
            // Only the activity log needs a background refresh.
            fetchActivities();

        } catch (err) {
            setTasks(previousTasks);
            setProgress(previousProgress);

            setError(
                err?.message ||
                "Unable to update task."
            );
        }
    };


    const handleArchiveTask = async (
        task
    ) => {
        if (
            !canArchiveTasksPerm ||
            !task?._id
        ) {
            return;
        }

        try {
            setError("");

            await archiveTask(
                task._id
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to archive task."
            );
        }
    };


    const handleReorderTasks = async (
        sourceId,
        targetId
    ) => {
        if (
            !sourceId ||
            !targetId ||
            sourceId === targetId
        ) {
            return;
        }

        const ids =
            tasks.map(
                (task) => String(task._id)
            );

        const fromIndex =
            ids.indexOf(String(sourceId));

        const toIndex =
            ids.indexOf(String(targetId));

        if (
            fromIndex === -1 ||
            toIndex === -1
        ) {
            return;
        }

        // Snapshot for rollback if the request fails.
        const previousTasks = tasks;

        // Apply the reorder to local state immediately —
        // no waiting on the network for the UI to respond.
        const reorderedTasks =
            [...tasks];

        const [moved] =
            reorderedTasks.splice(
                fromIndex,
                1
            );

        reorderedTasks.splice(
            toIndex,
            0,
            moved
        );

        setTasks(reorderedTasks);
        setError("");

        try {
            await reorderTasks(
                workId,
                reorderedTasks.map(
                    (task) => String(task._id)
                )
            );

            // Success — local state already matches the server.
            // Only the activity log needs a background refresh;
            // everything else (tasks, work, progress) is already correct.
            fetchActivities();

        } catch (err) {
            // Roll back to the pre-drag order.
            setTasks(previousTasks);

            setError(
                err?.message ||
                "Unable to reorder tasks."
            );
        }
    };


    // ========================================================
    // SUBTASK TOGGLE / ARCHIVE
    // ========================================================

    const handleSubtaskToggle = async (
        subtask
    ) => {
        const subtaskId = subtask?._id;

        if (!subtaskId) {
            return;
        }

        const shouldComplete =
            !subtask.completed;

        if (
            shouldComplete &&
            !canCompleteSubtasks
        ) {
            return;
        }

        if (
            !shouldComplete &&
            !canReopenSubtasks
        ) {
            return;
        }

        const previousTasks = tasks;
        const previousProgress = progress;

        const optimisticTasks =
            tasks.map(
                (task) => {
                    const subtaskList =
                        Array.isArray(
                            task.subtasks
                        )
                            ? task.subtasks
                            : [];

                    const hasThisSubtask =
                        subtaskList.some(
                            (item) =>
                                String(item._id) === String(subtaskId)
                        );

                    if (!hasThisSubtask) {
                        return task;
                    }

                    const updatedSubtasks =
                        subtaskList.map(
                            (item) =>
                                String(item._id) === String(subtaskId)
                                    ? {
                                        ...item,
                                        completed:
                                            shouldComplete,
                                    }
                                    : item
                        );

                    const allCompleted =
                        updatedSubtasks.length > 0 &&
                        updatedSubtasks.every(
                            (item) => item.completed
                        );

                    return {
                        ...task,
                        subtasks:
                            updatedSubtasks,
                        status:
                            allCompleted
                                ? "COMPLETED"
                                : "INCOMPLETE",
                        completed:
                            allCompleted,
                    };
                }
            );

        setTasks(optimisticTasks);

        setProgress(
            calculateLocalProgress(
                optimisticTasks
            )
        );

        setError("");

        try {
            if (shouldComplete) {
                await completeSubtask(
                    subtaskId
                );
            } else {
                await reopenSubtask(
                    subtaskId
                );
            }

            fetchActivities();

        } catch (err) {
            setTasks(previousTasks);
            setProgress(previousProgress);

            setError(
                err?.message ||
                "Unable to update subtask."
            );
        }
    };


    const handleArchiveSubtask = async (
        subtask
    ) => {
        if (
            !canArchiveSubtasksPerm ||
            !subtask?._id
        ) {
            return;
        }

        try {
            setError("");

            await archiveSubtask(
                subtask._id
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to archive subtask."
            );
        }
    };


    const handleReorderSubtasks = async (
        taskId,
        sourceId,
        targetId
    ) => {
        if (
            !taskId ||
            !sourceId ||
            !targetId ||
            sourceId === targetId
        ) {
            return;
        }

        const taskIndex =
            tasks.findIndex(
                (item) =>
                    String(item._id) === String(taskId)
            );

        if (taskIndex === -1) {
            return;
        }

        const task = tasks[taskIndex];

        const subtaskList =
            Array.isArray(
                task?.subtasks
            )
                ? task.subtasks
                : [];

        const ids =
            subtaskList.map(
                (subtask) => String(subtask._id)
            );

        const fromIndex =
            ids.indexOf(String(sourceId));

        const toIndex =
            ids.indexOf(String(targetId));

        if (
            fromIndex === -1 ||
            toIndex === -1
        ) {
            return;
        }

        // Snapshot for rollback if the request fails.
        const previousTasks = tasks;

        const reorderedSubtasks =
            [...subtaskList];

        const [moved] =
            reorderedSubtasks.splice(
                fromIndex,
                1
            );

        reorderedSubtasks.splice(
            toIndex,
            0,
            moved
        );

        const nextTasks =
            [...tasks];

        nextTasks[taskIndex] = {
            ...task,
            subtasks: reorderedSubtasks,
        };

        setTasks(nextTasks);
        setError("");

        try {
            await reorderSubtasks(
                taskId,
                reorderedSubtasks.map(
                    (subtask) => String(subtask._id)
                )
            );

            fetchActivities();

        } catch (err) {
            setTasks(previousTasks);

            setError(
                err?.message ||
                "Unable to reorder subtasks."
            );
        }
    };

    // ========================================================
    // COMMENTS
    // ========================================================

    const handleAddComment = async (
        description
    ) => {
        try {
            await createWorkComment(
                workId,
                {
                    description,
                }
            );

            await fetchComments();
            await fetchActivities();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to add comment."
            );

            throw err;
        }
    };


    const handleUpdateComment = async (
        commentId,
        description
    ) => {
        try {
            await updateWorkComment(
                commentId,
                {
                    description,
                }
            );

            await fetchComments();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to update comment."
            );

            throw err;
        }
    };


    const handleDeleteComment = async (
        commentId
    ) => {
        try {
            await deleteWorkComment(
                commentId
            );

            await fetchComments();
            await fetchActivities();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to delete comment."
            );

            throw err;
        }
    };


    // ========================================================
    // LINKS
    // ========================================================

    const handleAddLink = async (
        payload
    ) => {
        await createWorkLink(
            workId,
            payload
        );

        await fetchLinks();
        await fetchActivities();
    };


    const handleUpdateLink = async (
        linkId,
        payload
    ) => {
        await updateWorkLink(
            linkId,
            payload
        );

        await fetchLinks();
        await fetchActivities();
    };


    const handleDeleteLink = async (
        linkId
    ) => {
        await deleteWorkLink(
            linkId
        );

        await fetchLinks();
        await fetchActivities();
    };


    // ========================================================
    // PARTICIPANTS
    // ========================================================

    const handleAddParticipant = async (
        adminId
    ) => {
        if (
            !work ||
            !canManageWorkParticipants
        ) {
            return;
        }

        const adminObj =
            admins.find(
                (item) =>
                    String(getId(item)) === String(adminId)
            );

        const previousWork = work;

        const optimisticParticipants = [
            ...(Array.isArray(work.participants)
                ? work.participants
                : []),
            {
                admin:
                    adminObj || { _id: adminId },
                addedBy: admin,
                addedAt:
                    new Date().toISOString(),
            },
        ];

        setWork({
            ...work,
            participants:
                optimisticParticipants,
        });

        try {
            await addWorkParticipant(
                workId,
                adminId
            );

            // Quiet background sync (no loading screen) to pick up
            // the server's fully populated version.
            await fetchWork(true);
            fetchActivities();

        } catch (err) {
            setWork(previousWork);

            setError(
                err?.message ||
                "Unable to add participant."
            );
        }
    };


    const handleRemoveParticipant = async (
        adminId
    ) => {
        if (
            !work ||
            !canManageWorkParticipants
        ) {
            return;
        }

        const previousWork = work;

        const optimisticParticipants =
            (
                Array.isArray(work.participants)
                    ? work.participants
                    : []
            ).filter(
                (participant) => {
                    const participantId =
                        getId(participant?.admin) ||
                        getId(participant);

                    return (
                        String(participantId) !==
                        String(adminId)
                    );
                }
            );

        setWork({
            ...work,
            participants:
                optimisticParticipants,
        });

        try {
            await removeWorkParticipant(
                workId,
                adminId
            );

            await fetchWork(true);
            fetchActivities();

        } catch (err) {
            setWork(previousWork);

            setError(
                err?.message ||
                "Unable to remove participant."
            );
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (value) =>
                                !value
                        )
                    }
                />

                <AdminSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />

                <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                    <div className="flex min-h-[70vh] items-center justify-center">

                        <p className="text-sm text-[var(--muted)]">
                            Loading work...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!work) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (value) =>
                                !value
                        )
                    }
                />

                <AdminSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />

                <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/worklist"
                                )
                            }
                            className="mb-6 text-sm text-[var(--muted)] hover:text-[var(--text)]"
                        >
                            ← Back to work list
                        </button>

                        <div className="border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
                            {error ||
                                "Work not found."}
                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-[var(--surface)]">

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen(
                        (value) =>
                            !value
                    )
                }
            />

            <AdminSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-8 md:px-10 lg:px-12">

                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setActivityModalOpen(true)
                            }
                            className="border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--card)]"
                        >
                            View activity log
                        </button>

                        <button
                            type="button"
                            onClick={
                                refreshAll
                            }
                            disabled={
                                refreshing
                            }
                            className="flex items-center gap-2 border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:opacity-50"
                        >
                            {refreshing && (
                                <Loader2
                                    size={14}
                                    className="animate-spin"
                                />
                            )}
                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>
                    </div>


                    {error && (
                        <div className="border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}


                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <Header
                        work={work}
                        progress={progress}
                        canEdit={canEdit}
                        canArchive={canArchive}
                        canRestore={canRestore}
                        canLock={canLock}
                        canUnlock={canUnlock}
                        onArchive={handleArchive}
                        onRestore={handleRestore}
                        onLock={handleLock}
                        onUnlock={handleUnlock}
                        workListPath="/admin/worklist"
                        loading={refreshing}
                    />


                    {/* ==================================================
                        EDIT WORK
                    ================================================== */}

                    {canEdit &&
                        !isArchived && (
                            <div className="border border-[var(--border)] bg-[var(--card)] p-5">

                                {editingWork ? (
                                    <div className="space-y-4">

                                        <input
                                            value={
                                                workTitle
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setWorkTitle(
                                                    event.target.value
                                                )
                                            }
                                            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-lg font-semibold outline-none"
                                        />

                                        <textarea
                                            value={
                                                workDescription
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setWorkDescription(
                                                    event.target.value
                                                )
                                            }
                                            rows={5}
                                            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
                                        />

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                onClick={
                                                    handleSaveWork
                                                }
                                                disabled={
                                                    savingWork
                                                }
                                                className="bg-purple-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                            >
                                                {savingWork
                                                    ? "Saving..."
                                                    : "Save"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingWork(
                                                        false
                                                    );

                                                    setWorkTitle(
                                                        work.title ||
                                                        ""
                                                    );

                                                    setWorkDescription(
                                                        work.description ||
                                                        ""
                                                    );
                                                }}
                                                className="border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingWork(
                                                true
                                            )
                                        }
                                        className="text-sm font-semibold text-purple-400 transition hover:text-purple-300"
                                    >
                                        Edit work title / description
                                    </button>
                                )}

                            </div>
                        )}


                    {/* ==================================================
                        PROGRESS
                    ================================================== */}

                    <Progress
                        work={work}
                        tasks={tasks}
                    />


                    {/* ==================================================
                        TASKS
                    ================================================== */}

                    <section className="border border-[var(--border)] bg-[var(--card)]">

                        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

                            <div>
                                <h2 className="font-semibold">
                                    Tasks
                                </h2>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Manage the work tasks and their completion.
                                </p>
                            </div>

                            {canAddTasks &&
                                !isArchived &&
                                !isLocked && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewTaskOpen(
                                                (value) =>
                                                    !value
                                            )
                                        }
                                        className="flex items-center gap-2 bg-purple-500 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        <Plus size={15} />
                                        Add task
                                    </button>
                                )}

                        </div>


                        {newTaskOpen && (
                            <div className="border-b border-[var(--border)] p-5">

                                <input
                                    value={
                                        newTaskTitle
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewTaskTitle(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Task title"
                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                                />

                                <textarea
                                    value={
                                        newTaskDescription
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewTaskDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Description"
                                    rows={3}
                                    className="mt-3 w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleCreateTask
                                    }
                                    disabled={
                                        savingTask ||
                                        !newTaskTitle.trim()
                                    }
                                    className="mt-3 bg-purple-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    {savingTask
                                        ? "Creating..."
                                        : "Create task"}
                                </button>

                            </div>
                        )}


                        {tasks.length === 0 ? (

                            <div className="p-10 text-center text-sm text-[var(--muted)]">
                                No tasks yet.
                            </div>

                        ) : (

                            tasks.map(
                                (task) => (
                                    <Task
                                        key={task._id}
                                        task={task}
                                        subtasks={task.subtasks}
                                        canEdit={canAddTasks}
                                        canComplete={canCompleteTasks}
                                        canReopen={canReopenTasks}
                                        canArchive={canArchiveTasksPerm}
                                        canRestore={false}
                                        locked={isLocked}
                                        archived={isArchived}
                                        onToggle={handleTaskToggle}
                                        onEdit={openEditTask}
                                        onAddSubtask={(item) =>
                                            setNewSubtaskFor(
                                                item._id
                                            )
                                        }
                                        onArchive={handleArchiveTask}
                                        onReorder={handleReorderTasks}
                                        subtaskFormSlot={
                                            newSubtaskFor === task._id ? (
                                                <div>

                                                    <input
                                                        value={
                                                            newSubtaskTitle
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setNewSubtaskTitle(
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Subtask title"
                                                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
                                                    />

                                                    <textarea
                                                        value={
                                                            newSubtaskDescription
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setNewSubtaskDescription(
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Description (optional)"
                                                        rows={2}
                                                        className="mt-2 w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
                                                    />

                                                    <div className="mt-2 flex gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCreateSubtask(
                                                                    task._id
                                                                )
                                                            }
                                                            disabled={
                                                                savingSubtask ||
                                                                !newSubtaskTitle.trim()
                                                            }
                                                            className="bg-purple-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                                                        >
                                                            {savingSubtask
                                                                ? "Creating..."
                                                                : "Create"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setNewSubtaskFor(null);
                                                                setNewSubtaskTitle("");
                                                                setNewSubtaskDescription("");
                                                            }}
                                                            disabled={savingSubtask}
                                                            className="border border-[var(--border)] px-3 py-2 text-xs font-semibold"
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>
                                            ) : null
                                        }
                                        renderSubtask={(subtask) => (
                                            <Subtask
                                                key={subtask._id}
                                                subtask={subtask}
                                                canEdit={canAddSubtasks}
                                                canComplete={canCompleteSubtasks}
                                                canReopen={canReopenSubtasks}
                                                canArchive={canArchiveSubtasksPerm}
                                                canRestore={false}
                                                locked={isLocked}
                                                archived={isArchived}
                                                onToggle={handleSubtaskToggle}
                                                onEdit={openEditSubtask}
                                                onArchive={handleArchiveSubtask}
                                                onReorder={(sourceId, targetId) =>
                                                    handleReorderSubtasks(
                                                        task._id,
                                                        sourceId,
                                                        targetId
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                )
                            )

                        )}

                    </section>


                    {/* ==================================================
                        PARTICIPANTS
                    ================================================== */}

                    <Participants
                        work={work}
                        admins={admins}
                        canManage={canManageWorkParticipants}
                        disabled={isArchived}
                        onAdd={handleAddParticipant}
                        onRemove={handleRemoveParticipant}
                    />


                    {/* ==================================================
                        LINKS
                    ================================================== */}

                    <Links
                        links={links}
                        canEdit={canEdit}
                        disabled={isArchived || isLocked}
                        onAdd={handleAddLink}
                        onUpdate={handleUpdateLink}
                        onRemove={handleDeleteLink}
                    />


                    {/* ==================================================
                        COMMENTS
                    ================================================== */}

                    <Comments
                        work={work}
                        comments={comments}
                        currentAdmin={admin}
                        onAdd={handleAddComment}
                        onUpdate={handleUpdateComment}
                        onDelete={handleDeleteComment}
                        disabled={isArchived}
                    />


                </div>

            </main>


            {/* ========================================================
                EDIT TASK MODAL
            ======================================================== */}

            {editingTask && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">

                    <div className="w-full max-w-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl">

                        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

                            <h3 className="text-base font-semibold">
                                Edit task
                            </h3>

                            <button
                                type="button"
                                onClick={closeEditTask}
                                disabled={savingTaskEdit}
                                className="text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <div className="space-y-4 p-5">

                            <input
                                value={editTaskTitle}
                                onChange={(event) =>
                                    setEditTaskTitle(
                                        event.target.value
                                    )
                                }
                                maxLength={200}
                                disabled={savingTaskEdit}
                                placeholder="Task title"
                                className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400 disabled:opacity-50"
                            />

                            <textarea
                                value={editTaskDescription}
                                onChange={(event) =>
                                    setEditTaskDescription(
                                        event.target.value
                                    )
                                }
                                maxLength={2000}
                                rows={4}
                                disabled={savingTaskEdit}
                                placeholder="Description"
                                className="w-full resize-none border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400 disabled:opacity-50"
                            />

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeEditTask}
                                    disabled={savingTaskEdit}
                                    className="border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveTaskEdit}
                                    disabled={
                                        savingTaskEdit ||
                                        !editTaskTitle.trim()
                                    }
                                    className="bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingTaskEdit
                                        ? "Saving..."
                                        : "Save changes"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}


            {/* ========================================================
                EDIT SUBTASK MODAL
            ======================================================== */}

            {editingSubtask && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">

                    <div className="w-full max-w-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl">

                        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

                            <h3 className="text-base font-semibold">
                                Edit subtask
                            </h3>

                            <button
                                type="button"
                                onClick={closeEditSubtask}
                                disabled={savingSubtaskEdit}
                                className="text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <div className="space-y-4 p-5">

                            <input
                                value={editSubtaskTitle}
                                onChange={(event) =>
                                    setEditSubtaskTitle(
                                        event.target.value
                                    )
                                }
                                maxLength={200}
                                disabled={savingSubtaskEdit}
                                placeholder="Subtask title"
                                className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400 disabled:opacity-50"
                            />

                            <textarea
                                value={editSubtaskDescription}
                                onChange={(event) =>
                                    setEditSubtaskDescription(
                                        event.target.value
                                    )
                                }
                                maxLength={2000}
                                rows={3}
                                disabled={savingSubtaskEdit}
                                placeholder="Description (optional)"
                                className="w-full resize-none border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400 disabled:opacity-50"
                            />

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeEditSubtask}
                                    disabled={savingSubtaskEdit}
                                    className="border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveSubtaskEdit}
                                    disabled={
                                        savingSubtaskEdit ||
                                        !editSubtaskTitle.trim()
                                    }
                                    className="bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingSubtaskEdit
                                        ? "Saving..."
                                        : "Save changes"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}


            {/* ========================================================
                ACTIVITY LOG MODAL
            ======================================================== */}

            {activityModalOpen && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">

                    <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-[var(--border)] bg-[var(--card)] shadow-2xl">

                        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] p-5">

                            <h3 className="text-base font-semibold">
                                Activity log
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    setActivityModalOpen(false)
                                }
                                className="text-[var(--muted)] transition hover:text-[var(--text)]"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <Activity
                            activities={activities}
                            loading={activityLoading}
                            error={activityError}
                        />

                    </div>

                </div>
            )}

        </div>
    );
}

export default WorkDetails;