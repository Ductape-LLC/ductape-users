import { SUBSCRIPTION_CHARGE, WORKSPACE_GENERATE_BILLING_REPORT } from '../constants/user.constants.urls';
import client from '../clients/axios';

export const pricingClient = (auth: string) => {
  return client(process.env.PRICING_SERVICE as string, auth, 'application/json');
};

export const subscriptionCharge = async (payload: { auth: string; data: any }) => {
    try {
      const { auth, data } = payload;
      const response = await pricingClient(auth).post(SUBSCRIPTION_CHARGE, data);
      return response.data;
    } catch (e: any) {
      console.log(e);
      throw e.response.data.error;
    }
  }

  export const workspaceGenerateBillingReport = async (payload: { auth: string; data: any }) => {
    try {
      const { auth, data } = payload;
      const { workspace_id } = data;
      const URL = WORKSPACE_GENERATE_BILLING_REPORT + workspace_id
      const response = await pricingClient(auth).get(URL);
      return response.data;
    } catch (e: any) {
      console.log(e);
      throw e.response.data.error;
    }
  };
