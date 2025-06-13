FROM python:3.9-slim-buster
WORKDIR /app
COPY . /app
EXPOSE 8000
CMD ["python", "index.py"]