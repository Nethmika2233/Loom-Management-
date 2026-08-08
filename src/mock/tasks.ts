import type { Task, TaskStatus, Priority } from "@/types";
import { mockBoards } from "./boards";
import { mockLabels } from "./labels";
import { mockUsers } from "./users";

const TASK_BANK: Record<string, string[]> = {
  b1: [
    "Design new hero section",
    "Audit accessibility on marketing pages",
    "Build responsive navigation component",
    "Migrate design tokens to Tailwind config",
    "Write copy for pricing page",
    "Implement dark mode toggle",
    "QA test checkout flow",
    "Optimize LCP on homepage",
    "Create animated case study cards",
    "Set up Storybook for design system",
  ],
  b2: [
    "Implement push notifications",
    "Fix crash on iOS 18 launch",
    "Design onboarding carousel",
    "Integrate biometric auth",
    "Set up App Store screenshots",
    "Write release notes for v2.0",
    "Performance profiling on Android",
    "Localize app for 6 languages",
    "Beta test with TestFlight cohort",
    "Submit build to Play Store review",
  ],
  b3: [
    "Draft Q3 campaign brief",
    "Design social media assets",
    "Set up email drip sequence",
    "Coordinate influencer partnerships",
    "Launch paid search campaign",
    "Analyze competitor positioning",
    "Write blog post: growth playbook",
    "A/B test landing page variants",
  ],
  b4: [
    "Design GraphQL schema",
    "Write API versioning strategy",
    "Implement rate limiting middleware",
    "Set up API gateway",
    "Document new endpoints",
    "Migrate REST clients to GraphQL",
    "Load test API under 10k RPS",
    "Add OpenTelemetry tracing",
  ],
  b5: [
    "Map current onboarding journey",
    "Design welcome email sequence",
    "Build interactive product tour",
    "Reduce time-to-first-value",
    "Create customer success playbook",
    "Set up in-app checklist widget",
  ],
  b6: [
    "Archive unused internal scripts",
    "Deprecate legacy admin panel",
    "Migrate cron jobs to new infra",
  ],
};

const statuses: TaskStatus[] = ["todo", "doing", "review", "done"];
const priorities: Priority[] = ["low", "medium", "high", "urgent"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function pick<T>(arr: T[], rand: () => number) {
  return arr[Math.floor(rand() * arr.length)];
}

function buildTasks(): Task[] {
  const tasks: Task[] = [];
  let seed = 42;

  mockBoards.forEach((board) => {
    const titles = TASK_BANK[board.id] ?? [];
    const rand = seededRandom(seed);
    seed += 7;

    titles.forEach((title, index) => {
      const status = statuses[index % statuses.length];
      const columnIndex = statuses.indexOf(status);
      const column = board.columns[columnIndex];
      const priority = pick(priorities, rand);
      const assigneeCount = 1 + Math.floor(rand() * 2);
      const assigneeIds = board.memberIds
        .slice()
        .sort(() => rand() - 0.5)
        .slice(0, assigneeCount);
      const labelIds = mockLabels
        .slice()
        .sort(() => rand() - 0.5)
        .slice(0, 1 + Math.floor(rand() * 2))
        .map((l) => l.id);

      const checklistTotal = Math.floor(rand() * 5);
      const checklist = Array.from({ length: checklistTotal }, (_, i) => ({
        id: `${board.id}-t${index}-cl${i}`,
        text: `Checklist item ${i + 1}`,
        done: rand() > 0.5,
      }));

      const dayOffset = Math.floor(rand() * 30) - 10;
      const due = new Date();
      due.setDate(due.getDate() + dayOffset);

      const commentCount = Math.floor(rand() * 4);
      const comments = Array.from({ length: commentCount }, (_, i) => ({
        id: `${board.id}-t${index}-cm${i}`,
        authorId: pick(mockUsers, rand).id,
        content: pick(
          [
            "Looks good, let's ship it.",
            "Can we revisit the spacing here?",
            "I've updated the requirements doc.",
            "Blocked on design review.",
            "Great progress on this!",
          ],
          rand
        ),
        createdAt: new Date(Date.now() - Math.floor(rand() * 5) * 86400000).toISOString(),
      }));

      const attachmentCount = rand() > 0.7 ? 1 + Math.floor(rand() * 2) : 0;
      const attachments = Array.from({ length: attachmentCount }, (_, i) => ({
        id: `${board.id}-t${index}-att${i}`,
        name: pick(["spec.pdf", "mockup.fig", "screenshot.png", "notes.docx"], rand),
        size: `${(rand() * 5 + 0.2).toFixed(1)} MB`,
        type: "file",
        url: "#",
        uploadedAt: new Date(Date.now() - Math.floor(rand() * 10) * 86400000).toISOString(),
      }));

      const activity = [
        {
          id: `${board.id}-t${index}-act0`,
          actorId: pick(mockUsers, rand).id,
          action: "created this task",
          createdAt: new Date(Date.now() - Math.floor(rand() * 20 + 5) * 86400000).toISOString(),
        },
        {
          id: `${board.id}-t${index}-act1`,
          actorId: pick(mockUsers, rand).id,
          action: `moved this task to ${column.title}`,
          createdAt: new Date(Date.now() - Math.floor(rand() * 5) * 86400000).toISOString(),
        },
      ];

      tasks.push({
        id: `${board.id}-t${index}`,
        boardId: board.id,
        columnId: column.id,
        title,
        description:
          "This task covers the scope required to move this initiative forward. See checklist and comments for details on current progress and blockers.",
        status,
        priority,
        dueDate: due.toISOString(),
        assigneeIds,
        labelIds,
        checklist,
        comments,
        attachments,
        activity,
        estimatedHours: 2 + Math.floor(rand() * 12),
        loggedHours: Math.floor(rand() * 8),
        createdAt: new Date(Date.now() - Math.floor(rand() * 25 + 5) * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - Math.floor(rand() * 3) * 86400000).toISOString(),
        order: index,
      });
    });
  });

  return tasks;
}

export const mockTasks: Task[] = buildTasks();
