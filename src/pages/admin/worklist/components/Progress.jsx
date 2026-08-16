import { CheckCircle2, Circle } from "lucide-react";

function Progress({
    work,
    tasks = [],
}) {
    const calculateTaskProgress = (
        task
    ) => {
        const subtasks =
            task?.subtasks || [];

        if (subtasks.length === 0) {
            return task.status ===
                "COMPLETED"
                ? 100
                : 0;
        }

        const completed =
            subtasks.filter(
                (subtask) =>
                    subtask.completed
            ).length;

        return (
            (completed /
                subtasks.length) *
            100
        );
    };

    const taskProgresses =
        tasks.map(
            calculateTaskProgress
        );

    const progress =
        taskProgresses.length
            ? taskProgresses.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) /
            taskProgresses.length
            : 0;

    const roundedProgress =
        Math.round(progress);

    const completedTasks =
        taskProgresses.filter(
            (value) => value === 100
        ).length;

    return (
        <section className="border border-[var(--border)] bg-[var(--card)]">

            <div className="border-b border-[var(--border)] p-5">

                <div className="flex items-center justify-between gap-4">

                    <div>

                        <h2 className="text-base font-semibold">
                            Progress
                        </h2>

                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                            Progress is calculated automatically from task completion.
                        </p>

                    </div>

                    <span className="text-2xl font-bold">
                        {roundedProgress}%
                    </span>

                </div>


                <div className="mt-5 h-3 overflow-hidden bg-[var(--surface)]">

                    <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{
                            width: `${roundedProgress}%`,
                        }}
                    />

                </div>


                <div className="mt-3 flex justify-between text-xs text-[var(--muted)]">

                    <span>
                        {completedTasks} of{" "}
                        {tasks.length} tasks completed
                    </span>

                    <span>
                        {work?.status?.replace(
                            "_",
                            " "
                        )}
                    </span>

                </div>

            </div>


            {tasks.length > 0 && (
                <div className="divide-y divide-[var(--border)]">

                    {tasks.map(
                        (task) => {

                            const value =
                                Math.round(
                                    calculateTaskProgress(
                                        task
                                    )
                                );

                            const completed =
                                value === 100;

                            return (
                                <div
                                    key={
                                        task._id
                                    }
                                    className="flex items-center gap-3 p-4"
                                >

                                    {completed ? (
                                        <CheckCircle2
                                            size={17}
                                            className="shrink-0 text-green-400"
                                        />
                                    ) : (
                                        <Circle
                                            size={17}
                                            className="shrink-0 text-[var(--muted)]"
                                        />
                                    )}

                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-center justify-between gap-3">

                                            <p className="truncate text-sm font-medium">
                                                {task.title}
                                            </p>

                                            <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">
                                                {value}%
                                            </span>

                                        </div>


                                        <div className="mt-2 h-1.5 overflow-hidden bg-[var(--surface)]">

                                            <div
                                                className="h-full bg-purple-400 transition-all duration-300"
                                                style={{
                                                    width: `${value}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </section>
    );
}

export default Progress;