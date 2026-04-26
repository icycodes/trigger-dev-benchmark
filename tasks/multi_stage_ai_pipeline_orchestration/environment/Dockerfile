FROM local-run-harbor-base

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Trigger.dev environment for multi-stage AI pipeline orchestration task."

RUN mkdir -p /home/user/ai-pipeline && \
    cd /home/user/ai-pipeline && \
    npm init -y && \
    mkdir -p src/trigger && \
    mkdir -p /logs && echo "trial-123" > /logs/trial_id

# Container contents:
#   - Node.js v24 and npm
#   - python3 and pytest for verification
#   - /home/user/ai-pipeline project structure
#   - Mock /logs/trial_id for initial state tests

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
