FROM local-run-harbor-base

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash \
        ffmpeg jq && \
    pip3 install --break-system-packages pytest-xprocess && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Trigger.dev environment with FFmpeg and Node.js v24."

# Container contents:
#   - Node.js v24 for Trigger.dev
#   - ffmpeg and ffprobe for video processing
#   - python3-pytest for verification
#   - jq for JSON processing in scripts

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
