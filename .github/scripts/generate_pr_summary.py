import os
import re
import requests
from github import Github

# Fetch environment variables
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
REPO_NAME = os.getenv("GITHUB_REPOSITORY")
GITHUB_REF = os.getenv("GITHUB_REF")

# Extract PR number from GITHUB_REF
PR_NUMBER = int(re.search(r"refs/pull/(\d+)/merge", GITHUB_REF).group(1))

# Initialize GitHub API
g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)
pr = repo.get_pull(PR_NUMBER)

# Get PR changes
files = pr.get_files()
changes = "\n".join([f.filename for f in files])

# Call OpenAI API to generate summary
openai_url = "https://api.openai.com/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {OPENAI_API_KEY}",
    "Content-Type": "application/json",
}
data = {
    "model": "gpt-4",  # or "gpt-3.5-turbo"
    "messages": [
        {"role": "system", "content": "You are a helpful assistant that summarizes code changes."},
        {"role": "user", "content": f"Summarize the following changes in a pull request:\n{changes}"},
    ],
}
response = requests.post(openai_url, headers=headers, json=data)
summary = response.json()["choices"][0]["message"]["content"]

# Post summary as a comment on the PR
pr.create_issue_comment(f"### PR Summary\n{summary}")