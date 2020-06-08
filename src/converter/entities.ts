/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { getSeverity } from './utils';

export const getAccountEntity = (instance: any): Entity => ({
  _key: `bugcrowd:account:${instance.id}`,
  _type: 'bugcrowd_account',
  _class: ['Account'],
  name: instance.name,
  displayName: instance.name,
  description: instance.description,
});

export const getServiceEntity = (instance: any): Entity => ({
  _key: `bugcrowd:service:${instance.id}:bug-bounty`,
  _type: 'bugcrowd_service',
  _class: ['Service', 'Control'],
  name: 'Bugcrowd Security Testing',
  displayName: 'Bugcrowd Security Testing',
  description: 'Crowd-sourced security testing',
  category: 'software',
  function: ['appsec', 'bug-bounty', 'pen-test'],
});

export const convertBounty = (
  data: any,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
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
        createdOn: getTime(data.starts_at),
        startedOn: getTime(data.starts_at),
        stoppedOn: getTime(data.ends_at),
        active: data.status === 'live',
        webLink: `https://tracker.bugcrowd.com/${data.code}`,
        internal: false,
      },
    },
  });

export const convertFinding = (
  data: any,
): ReturnType<typeof createIntegrationEntity> => {
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
        createdOn: getTime(data.submitted_at),
        references: data.vulnerability_references_markdown,
        vulnerabilityReferencesMarkdown: undefined,
        numericSeverity: data.priority,
        severity: getSeverity(data.priority),
        webLink: data.bug_url,
        open: data.substate !== 'resolved',
        target: data.target?.name,
        rewards: data.monetary_rewards?.map((r) => r.amount),
        totalAmountAwarded: data.monetary_rewards?.reduce(
          (a, b) => a.amount + b.amount,
          0,
        ),
      },
    },
  });
};
