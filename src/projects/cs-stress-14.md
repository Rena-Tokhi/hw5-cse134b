---
layout: layouts/project.njk
title: CS Stress 14
description: "Case study: CS Stress 14, a task management app built with Cloudflare Workers (CSE 134B HW5)."
order: 1
flagship: true
image: /assets/img/placeholder-csstress14.svg
imageAlt: CS Stress 14 task management app screenshot placeholder
stack: ["JavaScript", "Cloudflare Workers", "REST API", "Git / GitHub"]
github: https://github.com/cse110-sp26-group14/cse110-sp26-group14
video: https://www.youtube.com/embed/BqogslvHUOw
problem: >
  For our CSE 110 team capstone, my four-person team needed to design and ship a working web
  application from scratch over a single quarter, applying agile practices (sprint
  planning, meeting notes, PR review) to a real product decision instead of a toy exercise.
  We landed on a task/backlog management tool, aimed at small teams who wanted something lighter
  than Jira.
role: >
  I built out the Cloudflare Workers API backend: the task CRUD endpoints, including create,
  update, and the <code>DELETE /api/tasks/:id</code> route, plus fixes to keep the task
  description field syncing correctly between the frontend form and the worker on save. I also
  reviewed teammates' pull requests and contributed to our meeting notes and design brief.
outcome: >
  The project shipped as a fully working full-stack app with <b>272 commits</b> across the team,
  a real collaboration history of design docs and PRs, and a recorded project demo. It's the most
  complete, most current project I can point to for full-stack development and API design.
---
