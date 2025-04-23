FROM python:3.13.3-alpine3.20

# Add build dependencies (including Rust)
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    cargo \
    rust \
    openssl-dev \
    build-base

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the outside world (you can change this to your app's port)
EXPOSE 5000

# # Run the application (replace this with your app's entry point)
# CMD ["python", "-m", "main"]