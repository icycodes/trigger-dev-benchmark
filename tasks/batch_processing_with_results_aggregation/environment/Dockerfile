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
LABEL Description="Trigger.dev task environment with Node.js v24 installed."

# Container contents:
#   - Node.js v24 for Trigger.dev development
#   - /home/user: base directory for projects
#   - python3 and pytest for initial and final state verification

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
