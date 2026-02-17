This file lists the prompts used during the development and testing of the application.

Development Prompts (Conversation with AI Assistant)
1. Initial Code Setup & Context Injection

"The document content is: {Screenshot of UI, space_manual.txt.txt content, sample_file.txt content} ... Please help me: 'use client' ... [Provided initial broken code with Hydration Error]"Context: This prompt provided the specific space_manual.txt.txt (Space Station Alpha) and sample_file.txt (Project Titan) to define the scope of data the app must handle and the UI reference point.

2. Hydration Error Fix

"Hydration failed because the server rendered HTML didn't match the client... give me the code"Context: Requesting the fix for the Next.js server-side rendering mismatch caused by LocalStorage access.

3. UI Refinement

"I like the previous design only can you give it without clumsy the grids should be seperated and the ui should be ui friendly clean and effective"Context: Iterating on the design to move from a "clumsy" look to a structured, grid-based layout.

4. Documentation

"Now give me the readme file""give me 10 commits to push this code into github"Context: Generating standard project documentation.

App Testing Queries (Using the 2 Text Files)
Test File 1: space_manual.txt.txt

User Input to App: "What happens if the artificial gravity fails?"Expected AI Output: "If the artificial gravity fails, hold onto the nearest railing."

Test File 2: sample_file.txt

User Input to App: "Who is the Team Lead for Project Titan?"Expected AI Output: "Sarah Jenkins."

User Input to App: "What is the Secret Code for Project Titan?"Expected AI Output: "Purple Elephant."