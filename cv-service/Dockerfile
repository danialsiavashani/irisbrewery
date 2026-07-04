# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM ubuntu:24.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    libopencv-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Download cpp-httplib (single header, gitignored in repo)
RUN wget -q https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h \
    -O /app/httplib.h

# Copy source files
COPY processor.hpp processor.cpp main.cpp Makefile ./

# Compile
RUN make

# ── Stage 2: runtime ────────────────────────────────────────────────────────
FROM ubuntu:24.04 AS runtime

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    libopencv-core406t64 \
    libopencv-imgproc406t64 \
    libopencv-imgcodecs406t64 \
    libopencv-highgui406t64 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only the compiled binary from the build stage
COPY --from=builder /app/cv-service .

EXPOSE 8001

CMD ["./cv-service"]