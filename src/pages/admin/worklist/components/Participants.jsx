import { useMemo, useState } from "react";
import {
    Users,
    UserPlus,
    UserMinus,
    ShieldCheck,
    Loader2,
} from "lucide-react";

const getId = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === "string") {
        return value;
    }

    return (
        value?._id ||
        value?.id ||
        value?.admin?._id ||
        value?.admin?.id ||
        value?.admin ||
        null
    )?.toString?.() || null;
};

const getAdminFromParticipant = (participant) => {
    return participant?.admin || participant;
};

function Participants({
    work,
    admins = [],
    canManage = false,
    disabled = false,
    onAdd,
    onRemove,
}) {
    const [selectedAdminIds, setSelectedAdminIds] =
        useState([]);

    const [saving, setSaving] =
        useState(false);

    const creatorId =
        getId(work?.createdBy);

    const participants =
        Array.isArray(work?.participants)
            ? work.participants
            : [];

    const participantIds = useMemo(
        () =>
            new Set(
                participants
                    .map((participant) =>
                        getId(participant)
                    )
                    .filter(Boolean)
                    .map(String)
            ),
        [participants]
    );

    const availableAdmins = useMemo(
        () =>
            admins.filter((admin) => {
                const adminId =
                    getId(admin);

                if (!adminId) {
                    return false;
                }

                if (
                    String(adminId) ===
                    String(creatorId)
                ) {
                    return false;
                }

                if (
                    participantIds.has(
                        String(adminId)
                    )
                ) {
                    return false;
                }

                return (
                    admin.status !==
                    "INACTIVE"
                );
            }),
        [
            admins,
            creatorId,
            participantIds,
        ]
    );

    const toggleAdmin = (adminId) => {
        const id = String(adminId);

        setSelectedAdminIds(
            (current) =>
                current.includes(id)
                    ? current.filter(
                        (value) =>
                            value !== id
                    )
                    : [...current, id]
        );
    };

    const handleAdd = async () => {
        if (
            saving ||
            disabled ||
            !canManage ||
            !selectedAdminIds.length
        ) {
            return;
        }

        try {
            setSaving(true);

            /*
             * Work API accepts one adminId per call:
             *
             * addWorkParticipant(workId, adminId)
             *
             * The parent handles the actual API call.
             */

            for (
                const adminId
                of selectedAdminIds
            ) {
                await onAdd?.(adminId);
            }

            setSelectedAdminIds([]);
        } catch (error) {
            console.error(
                "Failed to add participant:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (
        adminId
    ) => {
        if (
            saving ||
            disabled ||
            !canManage ||
            !adminId
        ) {
            return;
        }

        try {
            setSaving(true);

            await onRemove?.(
                adminId
            );
        } catch (error) {
            console.error(
                "Failed to remove participant:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="border border-[var(--border)] bg-[var(--card)]">

            {/* HEADER */}

            <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center bg-purple-500/10 text-purple-400">
                        <Users size={18} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold">
                            Participants
                        </h2>

                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                            Admins who can contribute to this work.
                        </p>
                    </div>

                </div>

                <span className="text-xs font-semibold text-[var(--muted)]">
                    {participants.length} participant
                    {participants.length === 1
                        ? ""
                        : "s"}
                </span>

            </div>

            {/* PARTICIPANTS */}

            <div className="divide-y divide-[var(--border)]">

                {/* CREATOR */}

                {work?.createdBy && (
                    <div className="flex items-center gap-3 p-5">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-purple-500/10 text-sm font-bold text-purple-400">
                            {(
                                work.createdBy.fullName ||
                                work.createdBy.username ||
                                "A"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold">
                                {work.createdBy.fullName ||
                                    work.createdBy.username ||
                                    "Unknown admin"}
                            </p>

                            <p className="mt-0.5 text-xs text-[var(--muted)]">
                                {work.createdBy.username
                                    ? `@${work.createdBy.username}`
                                    : "Work creator"}
                            </p>

                        </div>

                        <span className="flex items-center gap-1.5 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-400">
                            <ShieldCheck size={12} />
                            Creator
                        </span>

                    </div>
                )}

                {/* PARTICIPANTS */}

                {participants.map(
                    (participant) => {
                        const admin =
                            getAdminFromParticipant(
                                participant
                            );

                        const adminId =
                            getId(admin);

                        const name =
                            admin?.fullName ||
                            admin?.username ||
                            "Unknown admin";

                        const image =
                            admin?.profileImage?.url;

                        return (
                            <div
                                key={adminId}
                                className="flex items-center gap-3 p-5"
                            >

                                {image ? (
                                    <img
                                        src={image}
                                        alt=""
                                        className="h-10 w-10 shrink-0 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--surface)] text-sm font-bold text-[var(--muted)]">
                                        {name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-semibold">
                                        {name}
                                    </p>

                                    {admin?.username && (
                                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                                            @{admin.username}
                                        </p>
                                    )}

                                </div>

                                {canManage &&
                                    !disabled && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(
                                                    adminId
                                                )
                                            }
                                            disabled={
                                                saving
                                            }
                                            className="flex items-center gap-1.5 border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <Loader2
                                                    size={13}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <UserMinus
                                                    size={13}
                                                />
                                            )}
                                            Remove
                                        </button>
                                    )}

                            </div>
                        );
                    }
                )}

                {participants.length === 0 && (
                    <div className="p-8 text-center">

                        <Users
                            size={24}
                            className="mx-auto text-[var(--muted)]"
                        />

                        <p className="mt-3 text-sm font-medium">
                            No participants yet.
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            The creator is currently the only contributor.
                        </p>

                    </div>
                )}

            </div>

            {/* ADD */}

            {canManage &&
                !disabled &&
                availableAdmins.length > 0 && (

                    <div className="border-t border-[var(--border)] p-5">

                        <div className="flex items-center gap-2">

                            <UserPlus
                                size={16}
                                className="text-purple-400"
                            />

                            <h3 className="text-sm font-semibold">
                                Add participants
                            </h3>

                        </div>

                        <div className="mt-4 max-h-60 overflow-y-auto border border-[var(--border)]">

                            {availableAdmins.map(
                                (admin) => {
                                    const id =
                                        getId(admin);

                                    const selected =
                                        selectedAdminIds.includes(
                                            String(id)
                                        );

                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() =>
                                                toggleAdmin(
                                                    id
                                                )
                                            }
                                            disabled={
                                                saving
                                            }
                                            className={`flex w-full items-center gap-3 border-b border-[var(--border)] p-3 text-left transition last:border-b-0 ${
                                                selected
                                                    ? "bg-purple-500/10"
                                                    : "hover:bg-[var(--surface)]"
                                            }`}
                                        >

                                            <span
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                                                    selected
                                                        ? "border-purple-400 bg-purple-500 text-white"
                                                        : "border-[var(--border)]"
                                                }`}
                                            >
                                                {selected &&
                                                    "✓"}
                                            </span>

                                            <div className="min-w-0">

                                                <p className="text-sm font-medium">
                                                    {admin.fullName ||
                                                        admin.username ||
                                                        "Unknown admin"}
                                                </p>

                                                {admin.username && (
                                                    <p className="text-xs text-[var(--muted)]">
                                                        @{admin.username}
                                                    </p>
                                                )}

                                            </div>

                                        </button>
                                    );
                                }
                            )}

                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={
                                saving ||
                                selectedAdminIds.length ===
                                0
                            }
                            className="mt-4 flex items-center justify-center gap-2 bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {saving ? (
                                <Loader2
                                    size={15}
                                    className="animate-spin"
                                />
                            ) : (
                                <UserPlus size={15} />
                            )}

                            Add selected

                        </button>

                    </div>
                )}

        </section>
    );
}

export default Participants;