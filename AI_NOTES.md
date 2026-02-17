
# AI_NOTES

## AI Usage
I utilized Large Language Models (LLMs) to accelerate development, debug complex Next.js issues, and generate the core application code.

**Primary LLM Provider:**
*   **App Backend:** Groq (llama-3.1-8b-instant)
    *   *Why:* Extremely low latency and high speed for Retrieval-Augmented Generation (RAG). It serves as a cost-effective, high-performance inference engine for the "Private Knowledge" aspect of the project.
*   **Development Assistant:** ChatGPT (GPT-4o) / Claude
    *   *Why:* Used for React component debugging, resolving Next.js hydration errors, and refining UI CSS layouts.

## Tasks Checked Manually
While AI generated the boilerplate and styled the UI, I manually verified:
1.  **Security:** Ensured API keys are handled via `.env` and not hardcoded in the repository.
2.  **Data Integrity:** Verified that the file chunking strategy correctly splits text files into manageable context windows.
3.  **UI/UX:** Tested the responsiveness and flow of the "Inject Data" -> "Query" -> "Verify" cycle.
4.  **Specific Data Testing:**
    *   Tested **RAG retrieval** using `space_manual.txt.txt` to verify queries about "Oxygen Levels" returned the correct context.
    *   Tested **Policy extraction** using `sample_file.txt` to verify queries about "Project Titan" extracted the correct "Team Lead".
