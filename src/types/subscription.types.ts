import mongoose, { Document } from "mongoose";

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAST_DUE = 'overdue',
}

interface IProductLimits {
  caches: number;
  databases: number;
  actions: number;
  storageUnits: number;
  messageBrokers: number;
  notifiers: number;
  jobs: number;
  cloudFunctions: number;
}

interface IUsagePricing {
  additionalRequestPrice: number;
  additionalStoragePrice: number;
}

interface IMarketplaceAccess {
  canPublish: boolean;
  revenueShare: number;
}

interface IResourcePricing {
  action: number;
  cache: number;
  database: number;
  storage: number;
  messageBroker: number;
  notifier: number;
  job: number;
  cloudFunction: number;
  log: number;
  app: number;
  product: number;
  user: number;
}

export interface ISubscriptionPlan extends Document {
  name: string;
  tag: string;
  isEnterprise: boolean;
  monthlyPrice: number | null;
  description: string;
  users: number | null;
  monthlyRequests: number | null;
  fileTransfer: number | null;
  apps: number | null;
  products: number | null;
  logsRetentionDays: number | null;
  usageDataRetentionDays: number | null;
  productLimits: IProductLimits | null;
  marketplaceAccess: IMarketplaceAccess;
  usagePricing: IUsagePricing;
  isPayAsYouGo: boolean;
  resourcePricing?: IResourcePricing;
  customFeatures?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription extends Document {
  _id: any;
  plan_id: mongoose.Types.ObjectId;
  workspace_id: mongoose.Types.ObjectId;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  lastBillingDate: Date;
  nextBillingDate: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  subscription_id?: mongoose.Types.ObjectId;
  reason?: string;
}

export interface IPlanChangeHistory extends Document {
  workspace_id: mongoose.Types.ObjectId;
  subscription_id: mongoose.Types.ObjectId;
  oldPlanId: mongoose.Types.ObjectId;
  newPlanId: mongoose.Types.ObjectId;
  changeDate: Date;
  effectiveDate: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IResourceUsage {
  actions: number;
  caches: number;
  databases: number;
  storage: number;
  messageBrokers: number;
  notifiers: number;
  jobs: number;
  cloudFunctions: number;
  logs: number;
  apps: number;
  products: number;
  users: number;
  requests: number;
  fileTransfer: number;
}

export interface IBillingReport extends Document {
  workspace_id: mongoose.Types.ObjectId;
  subscription_id: mongoose.Types.ObjectId;
  plan_id: mongoose.Types.ObjectId;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  basePrice: number;
  resourceUsage: IResourceUsage;
  resourceCosts: {
    [K in keyof IResourceUsage]: number;
  };
  totalCost: number;
  paid: boolean;
  paidAt?: Date;
  payment_reference: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceUsage {
  dbActions: number;
  caches: number;
  databases: number;
  storageUnits: number;
  messageBrokers: number;
  notifiers: number;
  jobs: number;
  cloudFunctions: number;
  apps: number;
  products: number;
  users: number;
  requests: number;
}

export interface PlanChangeDetails {
  changeDate: string;
  effectiveDate: string;
  oldPlanUsedAmount: number;
  reason: string;
}

export interface BillingReport {
  resourceUsage: ResourceUsage;
  resourceCosts: ResourceUsage;
  _id: string;
  workspace_id: string;
  subscription_id: string;
  plan_id: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  basePrice: number;
  totalCost: number;
  paid: boolean;
  planChangeHistory: string[];
  planChangeReports: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanChangeHistory {
  previousPlanReport: {
    billingReport: BillingReport;
    planDetails: PlanChangeDetails;
  };
}

export interface BillingResponse {
  status: boolean;
  meta: Record<string, any>;
  data: {
    currentBillingReport: BillingReport;
    planChangeHistory: PlanChangeHistory | null;
  };
}

export interface PaymentAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string | null;
}

export interface PaymentCustomer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  customer_code: string;
  phone: string | null;
  metadata: any;
  risk_action: string;
  international_format_phone: string | null;
}

export interface PaymentLog {
  start_time: number;
  time_spent: number;
  attempts: number;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: any[];
  history: Array<{
    type: string;
    message: string;
    time: number;
  }>;
}

export interface PricingChargeResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number: string | null;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: PaymentLog;
    fees: number;
    fees_split: any;
    authorization: PaymentAuthorization;
    customer: PaymentCustomer;
    plan: any;
    split: Record<string, any>;
    order_id: string | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
    transaction_date: string;
    plan_object: Record<string, any>;
    subaccount: Record<string, any>;
  };
}
