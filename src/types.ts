export interface BountySubmission {
  uuid: string;
  title: string;
  description_markdown: string;
  extra_info_markdown: string;
  submitted_at: string;
  vulnerability_references_markdown: string;
  priority: number;
  bug_url: string;
  substate: string;
  target: {
    name: string;
  };
  monetary_rewards: {
    amount: number;
  }[];
}

export interface Bounty {
  bounty_type: string;
  code: string;
  custom_field_labels: any[];
  description_markdown: string;
  ends_at: string;
  low_reward: number;
  high_reward: number;
  name: string;
  participation: string;
  points_only: boolean;
  starts_at: string;
  targets_overview_markdown: string;
  targets_overview?: string;
  tagline: string;
  total_prize_pool: string;
  remaining_prize_pool: string;
  trial: boolean;
  demo: boolean;
  status: string;
  service_level: string;
  uuid: string;
  organization: {
    uuid: string;
    name: string;
  };
}
