FROM ubuntu:22.04

# Install system dependencies and development tools
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    python3 \
    python3-pip \
    vim \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Create a non-root user
RUN useradd -m -s /bin/bash ubuntu

# Set user and working directory
USER ubuntu
WORKDIR /home/ubuntu

# Set environment variables
ENV HOME=/home/ubuntu
ENV USER=ubuntu
ENV PATH="/home/ubuntu/.bun/bin:$PATH"
