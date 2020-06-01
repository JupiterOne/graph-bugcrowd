// Bugcrowd severity/priority is rated between 1-5
// https://www.bugcrowd.com/blog/vulnerability-prioritization-at-bugcrowd/
export function getSeverity(priority: number | undefined): string | undefined {
  if (priority === 1) {
    return 'critical';
  }
  if (priority === 2) {
    return 'high';
  }
  if (priority === 3) {
    return 'medium';
  }
  if (priority === 4) {
    return 'low';
  }
  if (priority === 5) {
    return 'info';
  }
}
