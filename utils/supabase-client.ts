import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import { ProductWithPrice } from 'types';
import type { Database } from 'types_db';

export const supabase = createBrowserSupabaseClient<Database>();

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  // TODO: improve the typing here.
  return (data as any) || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};

export const updateUserPrompt = async (user: User, prompt: string) => {
  await supabase
    .from('users')
    .update({
      user_prompt: prompt
    })
    .eq('id', user.id);
};

export const updateUserApi = async (user: User, api: string) => {
  await supabase
    .from('users')
    .update({
      user_api: api
    })
    .eq('id', user.id);
};

export const updateUserModel = async (user: User, model: string) => {
  await supabase
    .from('users')
    .update({
      user_model: model
    })
    .eq('id', user.id);
};

export const deleteUserEmbeddings = async (tblname: string) => {
  await supabase
    .from(tblname)
    .delete()
    .neq('id', 0)
};