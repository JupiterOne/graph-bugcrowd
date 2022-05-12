import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  convertProperties,
} from '@jupiterone/integration-sdk-core';
import { Bounty, BountySubmission } from '../../types';

// Bugcrowd severity/priority is rated between 1-5
// https://www.bugcrowd.com/blog/vulnerability-prioritization-at-bugcrowd/
const PRIORITY_TO_SEVERITY_MAP = new Map<number, string>([
  [1, 'critical'],
  [2, 'high'],
  [3, 'medium'],
  [4, 'low'],
  [5, 'info'],
]);

function getSeverity(priority: number) {
  return PRIORITY_TO_SEVERITY_MAP.get(priority) || 'critical';
}

export function createBountyEntity(data: Bounty): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: `bugcrowd-bounty:${data.code}`,
        _type: 'bugcrowd_bounty',
        _class: ['Program', 'Control'],
        name: data.name,
        displayName: `${data.name} ${data.tagline}`,
        type: 'bug-bounty',
        function: 'bug-bounty',
        description: data.description_markdown,
        descriptionMarkdown: undefined,
        overview: data.targets_overview,
        targetsOverview: undefined,
        createdOn: parseTimePropertyValue(data.starts_at),
        startedOn: parseTimePropertyValue(data.starts_at),
        stoppedOn: parseTimePropertyValue(data.ends_at),
        active: data.status === 'live',
        webLink: `https://tracker.bugcrowd.com/${data.code}`,
        internal: false,
      },
    },
  });
}

export function createBountySubmissionEntity(data: BountySubmission) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: `bugcrowd-submission:${data.uuid}`,
        _type: 'bugcrowd_submission',
        _class: ['Finding'],
        name: data.title,
        displayName: data.title,
        category: 'bug-bounty',
        description: data.description_markdown,
        descriptionMarkdown: undefined,
        details: data.extra_info_markdown,
        extraInfoMarkdown: undefined,
        createdOn: parseTimePropertyValue(data.submitted_at),
        references: data.vulnerability_references_markdown,
        vulnerabilityReferencesMarkdown: undefined,
        numericSeverity: data.priority,
        severity: getSeverity(data.priority),
        webLink: data.bug_url,
        open: data.substate !== 'resolved',
        targets: data.target?.name,
        rewards: data.monetary_rewards?.map((r) => r.amount),
        totalAmountAwarded: data.monetary_rewards?.reduce(
          (a, b) => a + b.amount,
          0,
        ),
      },
    },
  });
}
