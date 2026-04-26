export declare const myTask: import("@trigger.dev/sdk/v3").Task<"t", any, {
    run: {
        id: string;
        tags: string[];
        isTest: boolean;
        createdAt: Date;
        startedAt: Date;
        idempotencyKey?: string | undefined;
        idempotencyKeyScope?: "run" | "attempt" | "global" | undefined;
        maxAttempts?: number | undefined;
        version?: string | undefined;
        maxDuration?: number | undefined;
        priority?: number | undefined;
        baseCostInCents?: number | undefined;
        parentTaskRunId?: string | undefined;
        rootTaskRunId?: string | undefined;
        region?: string | undefined;
    };
    attempt: {
        number: number;
        startedAt: Date;
    };
    task: {
        id: string;
        filePath: string;
    } & {
        [k: string]: unknown;
    };
    queue: {
        name: string;
        id: string;
    };
    environment: {
        type: "PRODUCTION" | "STAGING" | "DEVELOPMENT" | "PREVIEW";
        id: string;
        slug: string;
        branchName?: string | undefined;
        git?: {
            dirty?: boolean | undefined;
            source?: "trigger_github_app" | "github_actions" | "local" | undefined;
            provider?: string | undefined;
            ghUsername?: string | undefined;
            ghUserAvatarUrl?: string | undefined;
            commitAuthorName?: string | undefined;
            commitMessage?: string | undefined;
            commitRef?: string | undefined;
            commitSha?: string | undefined;
            remoteUrl?: string | undefined;
            pullRequestNumber?: number | undefined;
            pullRequestTitle?: string | undefined;
            pullRequestState?: "open" | "closed" | "merged" | undefined;
        } | undefined;
    };
    organization: {
        name: string;
        id: string;
        slug: string;
    };
    project: {
        name: string;
        id: string;
        slug: string;
        ref: string;
    };
    machine: {
        cpu: number;
        memory: number;
        name: "micro" | "small-1x" | "small-2x" | "medium-1x" | "medium-2x" | "large-1x" | "large-2x";
        centsPerMs: number;
    };
    batch?: {
        id: string;
    } | undefined;
    deployment?: {
        id: string;
        version: string;
        shortCode: string;
        runtime: string;
        runtimeVersion: string;
        git?: {
            dirty?: boolean | undefined;
            source?: "trigger_github_app" | "github_actions" | "local" | undefined;
            provider?: string | undefined;
            ghUsername?: string | undefined;
            ghUserAvatarUrl?: string | undefined;
            commitAuthorName?: string | undefined;
            commitMessage?: string | undefined;
            commitRef?: string | undefined;
            commitSha?: string | undefined;
            remoteUrl?: string | undefined;
            pullRequestNumber?: number | undefined;
            pullRequestTitle?: string | undefined;
            pullRequestState?: "open" | "closed" | "merged" | undefined;
        } | undefined;
    } | undefined;
}>;
